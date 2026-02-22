import os

import google.generativeai as genai
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()
genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


class ContactRequest(BaseModel):
    name: str
    email: str
    message: str


@router.post("/chat")
async def chat(req: ChatRequest):
    from main import context_cache

    system_prompt = context_cache.get("system_prompt", "You are PK, Pranav Kowadkar's AI assistant.")

    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        system_instruction=system_prompt,
    )

    history = [
        {"role": h["role"], "parts": [h["content"]]}
        for h in req.history
    ]

    chat_session = model.start_chat(history=history)
    response = chat_session.send_message(req.message)
    return {"reply": response.text}


@router.post("/contact")
async def contact(req: ContactRequest):
    # TODO: Send email via SMTP. For now, just log it.
    print(f"[CONTACT] From: {req.name} <{req.email}> — {req.message}")
    return {"status": "received"}
