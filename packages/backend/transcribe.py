from typing import Any, Dict

import torch
import whisper

model = "medium.en"
audio_model = whisper.load_model(model)


def transcribe(audio_file) -> Dict[str, Any]:
    return audio_model.transcribe(
        audio_file,
        fp16=torch.cuda.is_available(),
        initial_prompt="LAPD radio traffic: penal codes (334), 10-x, 11-x, addresses",
    )
