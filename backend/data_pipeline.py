import base64
import os

import httpx


def load_autobiography(path: str = "data/autobiography.pdf") -> str:
    """Load autobiography from PDF. Returns empty string if file not found."""
    try:
        import fitz  # PyMuPDF

        doc = fitz.open(path)
        return "\n".join(page.get_text() for page in doc)
    except FileNotFoundError:
        return ""
    except ImportError:
        print("[WARN] PyMuPDF not installed, skipping autobiography")
        return ""


def load_resume(path: str = "data/resume.docx") -> str:
    """Load resume from DOCX. Returns empty string if file not found."""
    try:
        from docx import Document

        doc = Document(path)
        return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    except FileNotFoundError:
        return ""
    except ImportError:
        print("[WARN] python-docx not installed, skipping resume")
        return ""


async def fetch_github_context(token: str) -> str:
    """Fetch all repos + READMEs from GitHub."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        repos_resp = await client.get(
            "https://api.github.com/user/repos?per_page=100&type=all",
            headers=headers,
        )
        repos = repos_resp.json()

        if not isinstance(repos, list):
            print(f"[WARN] GitHub API returned unexpected response: {repos}")
            return ""

        context_parts = []
        for repo in repos:
            name = repo.get("name", "")
            desc = repo.get("description", "") or ""
            lang = repo.get("language", "") or ""
            updated = repo.get("updated_at", "")
            private = repo.get("private", False)

            # Fetch README
            readme_text = ""
            try:
                readme_resp = await client.get(
                    f"https://api.github.com/repos/{repo.get('full_name', '')}/readme",
                    headers=headers,
                )
                if readme_resp.status_code == 200:
                    readme_b64 = readme_resp.json().get("content", "")
                    readme_text = base64.b64decode(readme_b64).decode("utf-8")[:1500]
            except Exception:
                pass

            context_parts.append(
                f"### Repo: {name} ({'private' if private else 'public'})\n"
                f"Description: {desc}\nLanguage: {lang}\nLast updated: {updated}\n"
                f"README:\n{readme_text}\n"
            )

        return "\n".join(context_parts)


def build_system_prompt(autobiography: str, resume: str, github_context: str) -> str:
    return f"""You are PK — the AI version of Pranav Kowadkar, embedded in his portfolio at pkowadkar.vercel.app.

PERSONALITY: Direct, warm, technically fluent, slightly informal. You speak as Pranav, representing him. Never robotic. Never start responses with "Certainly!" or "Great question!" — just answer naturally.

CRITICAL RULES:
- Do NOT discuss technical implementation details of Project Poltergeist (stealth mechanisms, Windows API calls, screen capture methods). You can mention it exists and describe its multi-agent orchestration architecture only.
- Do NOT share Pranav's OPT expiry date unprompted.
- If someone asks to contact Pranav, direct them to the Messages app (bottom of dock) or LinkedIn (linkedin.com/in/pkowadkar).
- If you don't know something specific, say "I'm not sure about that one — reach out to Pranav directly."

=== PRANAV'S AUTOBIOGRAPHY ===
{autobiography[:6000]}

=== RESUME / CAREER FACTS ===
{resume[:3000]}

=== GITHUB REPOSITORIES ===
{github_context[:8000]}

=== QUICK REFERENCE ===
- Current role: AI Engineer, NJIT Brain Connectivity Lab under Dr. Bharat Biswal (March 2025–Present)
- Telegram: @pk_kowadkar | Email: pk.kowadkar@gmail.com
- Hackathon wins: 1st Place Pulse NYC (Search Sentinel), n8n Sponsor Prize ElevenLabs Hackathon (EZ OnCall)
- Speaking at LLM Day NYC March 6, 2026: "Multi-Agent Architectures: Solving Production LLM Reliability at Scale"
- Live product: CareerForge at forge-your-future.com
- F-1 STEM OPT valid through February 2027
"""
