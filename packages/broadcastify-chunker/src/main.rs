use std::{mem::MaybeUninit, sync::atomic::AtomicUsize};

use gst::{prelude::*, Bin, DebugGraphDetails, Element, GhostPad, Pad};
use gstreamer as gst;
use serde::{Deserialize, Serialize};

struct BroadcastifyToPcmOverUdp {
    playbin: Element,
    raw_audio_parse: Element,
    udp_sink: Element,
    sinkbin: gst::Bin,
    sinkbin_sinkpad: gst::GhostPad,
}

impl BroadcastifyToPcmOverUdp {
    fn initialize(
        this: &mut MaybeUninit<Self>,
        pipeline: &gst::Pipeline,
        broadcastify_uri: impl AsRef<str>,
        target_host: impl AsRef<str>,
        udp_port: u16,
    ) {
        static COUNT: AtomicUsize = AtomicUsize::new(0);
        let i = COUNT.fetch_add(1, std::sync::atomic::Ordering::Relaxed);
        // Step 1a: Create all of our elements
        let playbin = gst::ElementFactory::make("playbin")
            .name(format!("broadcastify_reader{i}",))
            .property("uri", broadcastify_uri.as_ref())
            .build()
            .unwrap();

        let sinkbin = gst::Bin::new(Some(format!("my fave sink bin{i}").as_str()));
        let sinkbin_sinkpad = gst::GhostPad::new(Some("sink"), gst::PadDirection::Sink);

        let raw_audio_parse = gst::ElementFactory::make("rawaudioparse")
            .name("RAWWW AUDIOO PARSE")
            .build()
            .unwrap();
        let udp_sink = gst::ElementFactory::make("udpsink")
            .property("host", target_host.as_ref())
            .property("port", udp_port as i32)
            .build()
            .unwrap();

        // Step 1b: Put them in a place in memory where they won't cause lifetime issues
        let this = this.write(Self {
            playbin,
            raw_audio_parse,
            udp_sink,
            sinkbin,
            sinkbin_sinkpad,
        });
        let BroadcastifyToPcmOverUdp {
            playbin,
            raw_audio_parse,
            udp_sink,
            sinkbin,
            sinkbin_sinkpad,
        } = this;

        // Step 2: Hook them all up!

        // Tell the stream viewer to forward audio into our sinkbin
        pipeline.add(playbin).unwrap();
        playbin.set_property("audio-sink", sinkbin.upcast_ref::<Element>());

        // Hook up the sinkbin's sink to the innards
        sinkbin.add_many(&[raw_audio_parse, udp_sink]).unwrap();
        sinkbin_sinkpad
            .set_target(raw_audio_parse.static_pad("sink").as_ref())
            .unwrap();
        sinkbin.add_pad(sinkbin_sinkpad).unwrap();
        raw_audio_parse.link(udp_sink).unwrap();
    }
}

#[derive(Clone, PartialEq, Eq, Serialize, Deserialize)]
struct Broadcast {
    uri: String,
    host: String,
    port: u16,
}

fn main() {
    // Initialize GStreamer
    gst::init().unwrap();

    let streams = std::env::args()
        .nth(2)
        .map(|filepath| serde_json::from_reader(std::fs::File::open(filepath).unwrap()).unwrap())
        .unwrap_or_else(|| {
            vec![
                Broadcast {
                    uri: "https://broadcastify.cdnstream1.com/33623".into(),
                    host: "127.0.0.1".into(),
                    port: 5556,
                },
                Broadcast {
                    uri: "https://broadcastify.cdnstream1.com/26569".into(),
                    host: "127.0.0.1".into(),
                    port: 5555,
                },
            ]
        });

    println!("{}", serde_json::to_string_pretty(&streams).unwrap());

    // Build pipeline
    let pipeline = gst::Pipeline::new(None);

    let mut pipeline_components = {
        let mut v = Vec::with_capacity(streams.len());
        // SAFETY: It is okay for the `MaybeUninit`s to be uninit, and we have allocated enough space to do this
        unsafe { v.set_len(streams.len()) };
        v
    };

    for (out, Broadcast { uri, host, port }) in
        Iterator::zip(pipeline_components.iter_mut(), streams)
    {
        BroadcastifyToPcmOverUdp::initialize(out, &pipeline, uri, host, port);
    }

    // Start pipeline
    pipeline.set_state(gst::State::Playing).unwrap();

    println!("playing :)");

    // Wait for pipeline to finish
    let bus = pipeline.bus().unwrap();
    for msg in bus.iter_timed(gst::ClockTime::NONE) {
        match msg.view() {
            gst::MessageView::Eos(..) => break,
            gst::MessageView::Error(err) => {
                eprintln!(
                    "Error from {:?}: {}",
                    err.src().map(|e| e.path_string()),
                    err.error()
                );
                break;
            }
            _ => {
                if cfg!(debug_assertions) {
                    gst::debug_bin_to_dot_file(
                        pipeline.upcast_ref::<Bin>(),
                        DebugGraphDetails::ALL,
                        "uwu.dot",
                    );
                }
            }
        }
    }

    // Stop pipeline and clean up
    pipeline.set_state(gst::State::Null).unwrap();
}
