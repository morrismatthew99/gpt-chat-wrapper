from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gpt_wrapper import GPTWrapper
import os

# Optional: print to verify env variables for debugging
print("=== DEBUG: OPENAI_API_KEY ===")
print(os.getenv("OPENAI_API_KEY"))
print("=============================")

app = FastAPI()

# Allow your frontend (Vite dev server) to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the GPT wrapper with your model
bot = GPTWrapper(model="gpt-4o")  # You can use "gpt-3.5-turbo" to save quota

# Define the expected request format
class PromptRequest(BaseModel):
    prompt: str

# API endpoint to receive chat messages
@app.post("/api/chat")
async def chat_endpoint(request: PromptRequest):
    if not request.prompt.strip():
        return {"response": "No message provided."}
    response = bot.ask(request.prompt)
    return {"response": response}
