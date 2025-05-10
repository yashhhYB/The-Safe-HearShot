import socket
import time
import sys


localhost = "127.0.0.1"

# This port doesn't matter, it just helps with consistency
audio_file_sender_port = 12345

# only this one does
audio_file_receiver_port = 5555


def send_bytes(filename: str):
    # Create a UDP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(("0.0.0.0", audio_file_sender_port))

    # There are this many samples in a second. This lets us know how much to delay so that we send the audio in real time.
    sample_rate_hz = 16_000

    # Open the file for reading in binary mode
    with open(filename, "rb") as f:
        # Read the entire file into memory
        data = f.read()

        bytes_sent = 0
        while bytes_sent < len(data):
            # UDP sockets have a maximum size, but IP fragmentation will help increase the limit
            # to some extent
            num_bytes_to_send = min(8000, len(data) - bytes_sent)
            # Send the data over the socket
            sock.sendto(
                data[bytes_sent : bytes_sent + num_bytes_to_send],
                (localhost, audio_file_receiver_port),
            )
            bytes_sent += num_bytes_to_send

            print(
                f"Sent {num_bytes_to_send} bytes to {localhost}:{audio_file_receiver_port}"
            )

            # Assuming that we have 2-byte samples (signed 16-bit integer, little endian), figure out a realistic amount of time to wait
            num_samples = num_bytes_to_send / 2
            seconds_to_wait = num_samples / sample_rate_hz
            print(f"Waiting {seconds_to_wait} seconds")
            time.sleep(seconds_to_wait)
    print(f"Done sending: {bytes_sent} bytes")


def main():
    match sys.argv:
        case [_, filename]:
            send_bytes(filename)
        case _:
            raise LookupError(
                "Sasha needs to look at the `main` and pass the correct arguments to run this test script"
            )


if __name__ == "__main__":
    main()
