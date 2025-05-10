use std::io::{BufWriter, Write};
use std::net::{ToSocketAddrs, UdpSocket, Ipv4Addr, IpAddr};
use std::sync::mpsc::channel;
use std::thread;

const BANDWIDTH: u32 = 10_000;
const FM_SAMPLE_RATE: u32 = 230_400;

struct SockWriter<A> {
    sock: UdpSocket,
    dest: A,
}

impl<A: ToSocketAddrs + Copy> std::io::Write for SockWriter<A> {
    fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
        self.sock.send_to(buf, self.dest)
    }

    fn flush(&mut self) -> std::io::Result<()> {
        Ok(())
    }
}

fn main() {
    let (mut ctl, mut reader) = rtlsdr_mt::open(0).unwrap();

    let sock = UdpSocket::bind((Ipv4Addr::new(127, 0, 0, 1), 19855)).unwrap();

    let mut writer = BufWriter::new(SockWriter {
        sock,
        dest: (Ipv4Addr::new(127, 0, 0, 1), 5555),
    });

    ctl.disable_agc().unwrap();
    ctl.set_tuner_gain(496).unwrap();
    println!("valid tuner gains: {:?}", {
        let mut x: [i32; 32] = [0; 32];
        ctl.tuner_gains(&mut x);
        x
    });
    ctl.set_ppm(0).unwrap();
    // Frequency
    ctl.set_center_freq(462_561_600).unwrap();
    ctl.set_sample_rate(FM_SAMPLE_RATE).unwrap();
    // How wide of a bandwidth are we doing?
    ctl.set_bandwidth(BANDWIDTH).unwrap();

    let (tx, rx) = channel::<Vec<i16>>();

    thread::spawn(move || loop {
        let audio_floats = rx.recv().unwrap();

        writer
            .write_all({
                let num_bytes = audio_floats.len() * core::mem::size_of::<i16>();
                let data_ptr = audio_floats.as_ptr().cast::<u8>();
                unsafe { core::slice::from_raw_parts(data_ptr, num_bytes) }
            })
            .unwrap();
    });

    reader
        .read_async(4, 32768, |bytes| {
            let mut iq_floats = bytes
                .chunks(2)
                .map(|iq| {
                    let to_float = |x| ((x as f32) / 127.5_f32) - 1.0;
                    let (i, q) = (iq[0], iq[1]);
                    demodulation::IQSample::new(to_float(i), to_float(q))
                })
                .collect::<Vec<_>>();

            let audio_floats = demodulation::demodulate(
                &mut iq_floats,
                demodulation::FMRadioConfig {
                    bandwidth: BANDWIDTH,
                    samplerate: FM_SAMPLE_RATE,
                    deviation: 46_00,
                },
            );

            tx.send(audio_floats).unwrap();

            // file.write_all({
            //     let num_bytes = audio_floats.len() * core::mem::size_of::<f32>();
            //     let data_ptr = audio_floats.as_ptr().cast::<u8>();
            //     unsafe { core::slice::from_raw_parts(data_ptr, num_bytes) }
            // })
            // .unwrap();
        })
        .unwrap();
}

mod demodulation {
    use std::vec;

    use liquid_dsp::firfilt;
    use liquid_dsp::freqdem;
    use liquid_dsp::msresamp;
    use num::complex::Complex32;

    pub type IQSample = Complex32;

    #[derive(Clone, Copy)]
    pub struct FMRadioConfig {
        pub bandwidth: u32,
        pub samplerate: u32,
        pub deviation: u32,
    }

    pub fn demodulate(samples: &mut [IQSample], config: FMRadioConfig) -> Vec<i16> {
        // Configure filter with info about the FM radio parameters
        let FMRadioConfig {
            bandwidth,
            samplerate,
            deviation,
        } = config;
        let filter_len = 64;
        let filter_cutoff_freq = bandwidth as f32 / samplerate as f32;
        let filter_attenuation = 100.0f32;

        // shitty squelching
        let avg = (samples.iter().map(|iq| iq.norm()).sum::<f32>() / samples.len() as f32);
        println!("avg: {avg:?}");
        if avg < 0.1 {
            let num_corresponding_silence_samples =
                samples.len() as f32 * DESIRED_SAMPLE_RATE as f32 / samplerate as f32;
            let num_corresponding_silence_samples = num_corresponding_silence_samples as usize;
            return vec![0; num_corresponding_silence_samples];
        }

        let filter = firfilt::FirFilterCrcf::kaiser(
            filter_len,
            filter_cutoff_freq,
            filter_attenuation,
            0.5f32,
        );
        filter.set_scale(2.0f32 * filter_cutoff_freq);

        filter.execute_block(samples);
        // Set up resampler to resample to 16kHz, which is crappy for audio
        const DESIRED_SAMPLE_RATE: u32 = 16_000;

        // Set up FM demodulator
        let modulation_factor = deviation as f32 / samplerate as f32;
        let fm_demod = freqdem::Freqdem::new(modulation_factor);

        /////
        // Actually do the demodulation + resampling!
        /////
        let raw_audio = fm_demod.demodulate_block(samples);
        let raw_audio = babycat::Waveform::new(samplerate, 1, raw_audio);
        let resampled_audio = raw_audio.resample(DESIRED_SAMPLE_RATE).unwrap();
        let mut ret: Vec<f32> = resampled_audio.into();
        for x in ret.iter_mut() {
            *x *= 10.0;
        }
        ret.into_iter().map(|x| {
            (x.clamp(-1., 1.) * 32_767.0) as i16
        }).collect()
    }
}
