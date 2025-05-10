from typing import List, Tuple
from pydantic import BaseModel
from enum import Enum


class TranscriptSection(BaseModel):
    start: float | None
    end: float | None
    content: str


class Transcription(BaseModel):
    name: str
    sections: List[TranscriptSection]


class Severity(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    FIRE = "fire"


class Alert(BaseModel):
    label: str
    severity: Severity
    date: float  # Unix timestamp
    transcript: List[TranscriptSection]

    raw_address: str
    address: str
    name: str
    coord: Tuple[float, float]  # latitude, longitude


class Location(BaseModel):
    address: str
    raw_address: str | None
    name: str
    latitude: float
    longitude: float
