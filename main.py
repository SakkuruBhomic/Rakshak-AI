
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os

# Import your long processing logic from logic.py
from logic import process_victim_voice

app = FastAPI(title="Rakshak AI API")

# Enable CORS for Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Rakshak AI Backend Active"}

@app.post("/api/analyze")
async def analyze_voice(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    try:
        # Calls the function in logic.py where your long code sits
        result = process_victim_voice(temp_path)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return result