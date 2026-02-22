import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from routes.chat import router as chat_router
from data_pipeline import load_autobiography, load_resume, fetch_github_context, build_system_prompt

load_dotenv()

context_cache = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: build knowledge base
    token = os.getenv("GITHUB_TOKEN", "")
    autobiography = ""
    resume = ""
    github_context = ""

    try:
        autobiography = load_autobiography()
    except Exception as e:
        print(f"[WARN] Could not load autobiography: {e}")

    try:
        resume = load_resume()
    except Exception as e:
        print(f"[WARN] Could not load resume: {e}")

    if token:
        try:
            github_context = await fetch_github_context(token)
        except Exception as e:
            print(f"[WARN] Could not fetch GitHub context: {e}")

    context_cache["system_prompt"] = build_system_prompt(autobiography, resume, github_context)
    print("[INFO] System prompt built successfully")
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pkowadkar.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/refresh-context")
async def refresh(x_secret: str = Header(...)):
    if x_secret != os.getenv("REFRESH_SECRET"):
        raise HTTPException(status_code=403, detail="Forbidden")

    token = os.getenv("GITHUB_TOKEN", "")
    github_context = ""

    if token:
        github_context = await fetch_github_context(token)

    autobiography = load_autobiography()
    resume = load_resume()
    context_cache["system_prompt"] = build_system_prompt(autobiography, resume, github_context)
    return {"status": "refreshed"}
