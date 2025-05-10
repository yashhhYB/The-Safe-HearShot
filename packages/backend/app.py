import requests
from pydantic import BaseModel
from fastapi import FastAPI

from os import environ

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}
