# pkowadkar — Portfolio v2 · Claude Code Spec
> Read this entire document before writing a single line of code. Architecture decisions are intentional. Do not improvise beyond what's specified without flagging it first.

---

## 0. Project Overview

A complete rebuild of Pranav Kowadkar's personal portfolio as a **Netflix-dark macOS desktop experience** in the browser. The user lands on a Netflix-style intro animation, which fades into a dark macOS-style desktop with a dock. Every section of the portfolio is an "app" that opens as a draggable window on the desktop.

**Live URL target:** `pkowadkar.vercel.app` (or custom domain later)
**Repo location:** `D:\My-Projects\Portfolio\pkowadkar`
**Reference site (old portfolio):** `D:\My-Projects\Portfolio\p-kowadkar.github.io`

---

## 1. Tech Stack — Non-Negotiable

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS v3** (utility-first, no component libraries except where specified)
- **Framer Motion** (animations — window open/close, dock bounce, intro fade)
- **react-rnd** (draggable + resizable windows — do NOT build from scratch)
- **Lucide React** (icons)
- **Google Fonts:** DM Serif Display, Outfit, DM Mono (same as CareerForge value prop)

### Backend
- **FastAPI** (Python 3.11)
- **google-generativeai** SDK for Gemini
- **python-dotenv** for env vars
- **uvicorn** as ASGI server
- **CORS** enabled for Vercel frontend origin

### Deployment
- **Frontend:** Vercel (free tier, auto-deploy from GitHub)
- **Backend:** Render (free tier, Web Service)
- **Keep-alive:** UptimeRobot pings `/health` endpoint every 5 min to prevent Render sleep
- **Env vars:** stored in Vercel + Render dashboards, never committed

### Package versions (use these exactly)
```json
{
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "framer-motion": "^11.0.0",
  "react-rnd": "^10.4.1",
  "lucide-react": "^0.263.1",
  "tailwindcss": "^3.4.0"
}
```

---

## 2. Folder Structure

```
pkowadkar/
├── frontend/
│   ├── public/
│   │   ├── favicon.svg           # pk monogram (copy from old portfolio static/favicon.svg)
│   │   └── sounds/
│   │       └── intro.mp3         # Netflix-style pk intro sound (copy from old portfolio background.mp3 or create)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Intro/
│   │   │   │   └── IntroScreen.jsx      # Netflix pk animation + sound → fades to desktop
│   │   │   ├── Desktop/
│   │   │   │   └── Desktop.jsx          # The macOS desktop container + wallpaper
│   │   │   ├── Dock/
│   │   │   │   └── Dock.jsx             # Bottom dock with app icons + bounce animation
│   │   │   ├── Window/
│   │   │   │   └── Window.jsx           # Reusable draggable window (uses react-rnd)
│   │   │   ├── DesktopWidgets/
│   │   │   │   └── AchievementsWidget.jsx  # Sticky widget always visible on desktop
│   │   │   └── apps/
│   │   │       ├── Projects/
│   │   │       │   └── ProjectsApp.jsx
│   │   │       ├── ChatPK/
│   │   │       │   └── ChatPKApp.jsx
│   │   │       ├── VideoCall/
│   │   │       │   └── VideoCallApp.jsx
│   │   │       ├── Messages/
│   │   │       │   └── MessagesApp.jsx
│   │   │       ├── Browser/
│   │   │       │   └── BrowserApp.jsx
│   │   │       └── Telegram/
│   │   │           └── TelegramApp.jsx
│   │   ├── data/
│   │   │   ├── projects.js         # All project data
│   │   │   ├── experience.js       # All experience data
│   │   │   ├── education.js        # Education data
│   │   │   └── skills.js           # Skills data
│   │   ├── hooks/
│   │   │   └── useWindowManager.js # Open/close/focus/minimize window state
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css               # Tailwind directives + global CSS vars
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── backend/
│   ├── main.py                     # FastAPI app entry point
│   ├── routes/
│   │   └── chat.py                 # /chat endpoint → Gemini 3.1 Pro
│   ├── requirements.txt
│   ├── .env.example
│   └── Procfile                    # For Render: "web: uvicorn main:app --host 0.0.0.0 --port $PORT"
└── README.md
```

---

## 3. Design System

### Colors (CSS custom properties — define in index.css)
```css
:root {
  --bg: #141414;           /* Netflix black — desktop background */
  --surface: #1a1a1a;      /* Window background */
  --surface2: #222222;     /* Elevated surfaces inside windows */
  --border: rgba(255,255,255,0.08);
  --border-bright: rgba(255,255,255,0.15);
  --accent: #E50914;       /* Netflix red — traffic lights, dock active indicator */
  --accent-dim: rgba(229,9,20,0.15);
  --text: #f0f0f2;
  --muted: #6b6b7a;
  --subtle: #3a3a47;
  --dock-bg: rgba(30,30,30,0.7);  /* Frosted dock */
}
```

### Typography
```css
/* Import in index.html head */
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

body { font-family: 'Outfit', sans-serif; }
h1, h2 { font-family: 'DM Serif Display', serif; }
code, .mono { font-family: 'DM Mono', monospace; }
```

### macOS Window Chrome
Every window has:
- Title bar: `#2a2a2a` background, 28px height
- Traffic light buttons: red `#E50914`, yellow `#f5a623`, green `#27c93f` — 12px circles, 6px apart
- Red button = close window, Yellow = minimize (hide to dock), Green = maximize (fill desktop)
- Window title centered in title bar, DM Mono 11px, color: `var(--muted)`
- `border-radius: 12px` on the window
- `box-shadow: 0 25px 60px rgba(0,0,0,0.6)`
- Backdrop blur on window background: `backdrop-filter: blur(20px)`

### Dock
- Fixed bottom center, `backdrop-filter: blur(20px)`, `background: var(--dock-bg)`
- `border-radius: 18px`, `border: 1px solid var(--border)`
- 8px padding, 12px gap between icons
- Icons: 52px × 52px, `border-radius: 12px`
- Hover: Framer Motion scale up to 1.3, neighbor icons scale to 1.15 (macOS magnification effect)
- Active app: small dot below icon (Netflix red)
- Bounce animation on click (Framer Motion spring)

### Noise Overlay (on desktop background)
```css
.desktop::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* fractal noise SVG */
  opacity: 0.03;
  pointer-events: none;
  z-index: 0;
}
```

---

## 4. Intro Screen (IntroScreen.jsx)

**Behavior:**
1. Full screen `#000000` background
2. Centered `pk` monogram appears with a Netflix-style "thud" animation — scales from 120% to 100%, red glow behind it fading in
3. Sound plays simultaneously (the `intro.mp3` from old portfolio — only if user has interacted with page, else skip silently)
4. Hold for 1.2 seconds
5. `pk` scales up to 150% and fades out simultaneously
6. Desktop fades in (opacity 0 → 1, 0.6s ease)
7. Intro never shows again in the session (use sessionStorage flag `pk_intro_shown`)

**Font:** DM Serif Display italic, 6rem, color white

---

## 5. Desktop (Desktop.jsx)

- Full viewport, `background: var(--bg)` with noise overlay
- Renders all open windows (from `useWindowManager` hook)
- Renders `AchievementsWidget` — always visible, positioned top-right
- Renders `Dock` fixed at bottom
- z-index management: clicking a window brings it to front (track `focusedWindow` in state)

### AchievementsWidget
Small floating card, top-right corner, non-draggable:
```
🏆 1st Place — Pulse NYC Hackathon (Search Sentinel)
🏆 n8n Sponsor Prize — ElevenLabs Global Hackathon (EZ OnCall)
🎤 Speaker — LLM Day NYC · March 6, 2026
```
Style: dark card, Netflix red left border strip, DM Mono 11px text, subtle animation on load

---

## 6. Window Manager Hook (useWindowManager.js)

Manages all window state:
```js
{
  windows: [
    {
      id: 'projects',
      title: 'Projects',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      defaultPosition: { x: 80, y: 60 },
      defaultSize: { width: 900, height: 600 },
    },
    // ... one entry per app
  ],
  openWindow: (id) => {},
  closeWindow: (id) => {},
  minimizeWindow: (id) => {},
  maximizeWindow: (id) => {},
  focusWindow: (id) => {},
}
```

---

## 7. Dock (Dock.jsx)

Apps in dock order (left → right):

| Order | ID | Label | Icon | App Component |
|-------|----|-------|------|---------------|
| 1 | `projects` | Projects | 📁 Folder icon | ProjectsApp |
| 2 | `chat` | ChatPK | 💬 Message bubble | ChatPKApp |
| 3 | `videocall` | Video Call | 📹 Video camera | VideoCallApp |
| 4 | `messages` | Messages | ✉️ Envelope | MessagesApp |
| 5 | `browser` | Browser | 🌐 Globe | BrowserApp |
| 6 | `telegram` | Telegram | ✈️ Paper plane | TelegramApp (deep link, no window) |

Use Lucide icons for all — `Folder`, `MessageCircle`, `Video`, `Mail`, `Globe`, `Send`.

Telegram click → `window.open('https://t.me/YOUR_TELEGRAM', '_blank')` — no window opens.

---

## 8. App Specs

### 8.1 ProjectsApp (ProjectsApp.jsx)

A folder view. Two-panel layout:
- **Left panel (280px):** List of project names, clickable rows, selected row highlighted with accent left border
- **Right panel (flex 1):** Detail view of selected project

**Project data (import from `data/projects.js`):**

```js
export const projects = [
  {
    id: 'search-sentinel',
    name: 'Search Sentinel',
    badge: '🏆 1st Place — Pulse NYC Hackathon',
    badgeColor: 'gold',  // renders as golden pill
    tagline: 'Agentic brand visibility tracking across AI search engines',
    description: `Built in 7 hours during a NYC snowstorm. Search Sentinel tracks how brands and content rank in AI-powered search responses (ChatGPT, Perplexity, Claude) — the search layer that's replacing Google. Multi-agent orchestration handles real-time analysis across multiple AI search platforms simultaneously.`,
    orchestration: 'Multi-Agent (Parallel)',
    tech: ['Python', 'FastAPI', 'Multi-agent orchestration', 'AI Search APIs', 'Real-time processing'],
    github: 'https://github.com/p-kowadkar/search-sentinel',
    demo: null,
  },
  {
    id: 'ez-oncall',
    name: 'EZ OnCall',
    badge: '🏆 n8n Sponsor Prize — ElevenLabs Global Hackathon',
    badgeColor: 'gold',
    tagline: 'Voice-first DevOps agent for hands-free incident response',
    description: `Voice-controlled DevOps agent that lets you manage infrastructure without touching a keyboard. Speak a command, get a response, trigger automations — all through ElevenLabs speech synthesis and n8n workflow orchestration.`,
    orchestration: null,
    tech: ['Python', 'ElevenLabs', 'n8n', 'FastAPI', 'Voice AI', 'DevOps automation'],
    github: 'https://github.com/p-kowadkar/ez-oncall',
    demo: null,
  },
  {
    id: 'careerforge',
    name: 'CareerForge',
    badge: '🔴 Live Product',
    badgeColor: 'red',
    tagline: 'End-to-end AI job application automation',
    description: `Production system actively running a 20+ application/day job search. ResumeForge, CoverForge, ForgeScore, Company Intelligence (live Firecrawl scraping + Health Score), Contact Finder, voice-to-voice InterviewAI (ElevenLabs), Kanban tracker, BYOK for 7+ LLM providers with pgcrypto encryption.`,
    orchestration: 'Hierarchical Multi-Agent (CareerCouncil: Brian → Rita‖Marcus → Robin → Ryan)',
    tech: ['React', 'TypeScript', 'Supabase', 'FastAPI', 'ElevenLabs', 'Firecrawl', 'Multi-agent', 'pgcrypto'],
    github: null,
    demo: 'https://www.forge-your-future.com',
    valueProp: 'https://p-kowadkar.github.io/careerforge',
  },
  {
    id: 'prometheus',
    name: 'PrometheusAI',
    badge: null,
    badgeColor: null,
    tagline: 'Self-improving multi-agent research system — 21x relevance improvement',
    description: `5-agent sequential pipeline (Architect → Scout → Analyst → Validator → Synthesizer) that researches, validates, and synthesizes information with intra-stage parallelism for concurrent source processing. Adaptive learning system with reward-based strategy optimization.`,
    orchestration: 'Sequential Pipeline Orchestration',
    tech: ['Python', 'You.com API', 'Multi-agent', 'SQLite', 'Gradio', 'Adaptive learning'],
    github: 'https://github.com/p-kowadkar/PrometheusAI',
    demo: null,
  },
  {
    id: 'poltergeist',
    name: 'Project Poltergeist',
    badge: '🔒 Closed Source',
    badgeColor: 'gray',
    tagline: 'Multi-agent AI assistant with hierarchical + async validator architecture',
    description: `Hierarchical orchestration with a twist: Phantomlord (master orchestrator) dispatches specialist agents top-down — CoderGhost, MCQGhost, MathGhost, CloudGhost, DataGhost, ArchitectGhost, OperatorGhost. Oracle runs as a detached async validator — Phantomlord doesn't wait for it. Ghost delivers in ~2s, Oracle researches in ~30s background and auto-improves the response without blocking delivery. Proprietary closed-source system.`,
    orchestration: 'Hierarchical + Async Validator (novel pattern)',
    tech: ['Python', 'Multi-agent orchestration', 'Voice AI', 'Faster-Whisper', 'Deepgram', 'Vision AI'],
    github: null,
    demo: null,
  },
  {
    id: 'smriti',
    name: 'Smriti',
    badge: '🚧 In Development',
    badgeColor: 'blue',
    tagline: 'Persistent-memory AI assistant — lazy memory, 1000x storage efficiency',
    description: `Sanskrit for "that which is remembered." Hybrid Rust-Python architecture: Rust core handles performance-critical capture and IPC, Python brain handles intelligence and memory. Lazy memory storage pipeline: capture → extract semantic meaning → discard raw data. Remembers across every session, grows smarter over time. Open-source.`,
    orchestration: null,
    tech: ['Python', 'Rust', 'Whisper', 'OCR', 'Vector DB', 'IPC', 'Semantic extraction'],
    github: null,
    demo: null,
  },
];
```

**Right panel renders:**
- Project name (DM Serif Display, 24px)
- Badge pill if present (gold/red/gray/blue background)
- Tagline (Outfit 15px, muted)
- Description paragraph
- Orchestration type chip (if present) — styled with accent border
- Tech stack pills (DM Mono, small)
- Links: GitHub button (if present), Demo button (if present), Value Prop link (CareerForge only)

---

### 8.2 ChatPKApp (ChatPKApp.jsx)

iMessage-style chat interface. Dark background, bubbles:
- User messages: Netflix red background, right-aligned
- PK responses: `var(--surface2)` background, left-aligned, with small `pk` avatar

**API call:**
```
POST /chat
Body: { message: string, history: [{role, content}] }
Response: { reply: string }
```

Model: `gemini-3.1-pro-preview`

**UI features:**
- Input field at bottom, send on Enter or button click
- Typing indicator (3 animated dots) while waiting for response
- Auto-scroll to bottom on new message
- "ChatPK" in title bar with small red dot (online indicator)

---

### 8.2.1 ChatPK Data Pipeline (Backend)

**This is NOT model fine-tuning. It is context injection (RAG-lite) at startup.**

The backend builds a rich knowledge base from 3 sources at Render startup, merges them into one system prompt, and injects that into every Gemini conversation. The model stays generic -- the context makes it knowledgeable.

#### Source 1: Static documents (provided manually by Pranav)
Place these in `backend/data/`:
- `autobiography.pdf` — "My Journey: From Belagavi Dreams to Silicon Valley Ambitions"
- `resume.docx` — Latest resume

At startup, parse both and extract clean text. Chunk the autobiography into ~800 token segments, keep the resume as structured facts.

```python
# backend/data_pipeline.py
import fitz  # PyMuPDF for PDF
from docx import Document

def load_autobiography(path="data/autobiography.pdf") -> str:
    doc = fitz.open(path)
    return "\n".join(page.get_text() for page in doc)

def load_resume(path="data/resume.docx") -> str:
    doc = Document(path)
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
```

#### Source 2: GitHub repos (via token)
At startup, fetch all repos (public + private) using a GitHub token with `repo` scope (read-only is fine -- use `read:user` + `repo` scopes).

```python
import httpx
import os

async def fetch_github_context(token: str) -> str:
    headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"}
    
    async with httpx.AsyncClient() as client:
        # Get all repos (public + private)
        repos_resp = await client.get(
            "https://api.github.com/user/repos?per_page=100&type=all",
            headers=headers
        )
        repos = repos_resp.json()
        
        context_parts = []
        for repo in repos:
            name = repo["name"]
            desc = repo.get("description", "")
            lang = repo.get("language", "")
            updated = repo.get("updated_at", "")
            private = repo.get("private", False)
            
            # Fetch README
            readme_resp = await client.get(
                f"https://api.github.com/repos/p-kowadkar/{name}/readme",
                headers=headers
            )
            readme_text = ""
            if readme_resp.status_code == 200:
                import base64
                readme_b64 = readme_resp.json().get("content", "")
                readme_text = base64.b64decode(readme_b64).decode("utf-8")[:1500]  # cap per repo
            
            context_parts.append(
                f"### Repo: {name} ({'private' if private else 'public'})\n"
                f"Description: {desc}\nLanguage: {lang}\nLast updated: {updated}\n"
                f"README:\n{readme_text}\n"
            )
        
        return "\n".join(context_parts)
```

#### Source 3: Hard-coded structured facts
Personality, tone, things NOT to say, redirect rules.

#### System prompt assembly
```python
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
```

#### Caching strategy
GitHub fetch is expensive -- run once at startup, cache in memory. Add a `/refresh-context` endpoint (protected by a simple secret header) so Pranav can manually trigger a refresh when he pushes new repos without restarting Render.

```python
# In main.py
context_cache = {}

@app.on_event("startup")
async def startup():
    token = os.getenv("GITHUB_TOKEN")
    autobiography = load_autobiography()
    resume = load_resume()
    github = await fetch_github_context(token)
    context_cache["system_prompt"] = build_system_prompt(autobiography, resume, github)

@app.post("/refresh-context")
async def refresh(x_secret: str = Header(...)):
    if x_secret != os.getenv("REFRESH_SECRET"):
        raise HTTPException(403)
    token = os.getenv("GITHUB_TOKEN")
    github = await fetch_github_context(token)
    autobiography = load_autobiography()
    resume = load_resume()
    context_cache["system_prompt"] = build_system_prompt(autobiography, resume, github)
    return {"status": "refreshed"}
```

#### Additional env vars needed
```
GITHUB_TOKEN=ghp_your_token_here   # repo read scope only
REFRESH_SECRET=any_random_string_you_choose
```

#### Files to add to backend/data/
- `autobiography.pdf` (upload manually after creating backend)
- `resume.docx` (upload manually after creating backend)
- Both files are gitignored (add to .gitignore) for privacy

#### Additional requirements.txt entries
```
PyMuPDF==1.24.0
python-docx==1.1.0
httpx==0.27.0
```

---

### 8.3 VideoCallApp (VideoCallApp.jsx)

**This is a placeholder — WIP digital twin.** Do not build actual functionality.

Render a fake video call UI:
- Dark background with subtle grid
- Centered card with a gradient avatar placeholder (initials "PK")
- Status text: `"Digital Twin — Coming Soon"`
- Subtext: `"An AI version of Pranav with real-time voice and vision. Check back soon."`
- Fake "End Call" button (red, disabled, just shows a toast "Not live yet")
- Nice animation: pulsing ring around the avatar placeholder

---

### 8.4 MessagesApp (MessagesApp.jsx)

Simple contact form styled as iMessage compose screen:

Fields:
- Your name (text input)
- Your email (email input)  
- Message (textarea, 4 rows)
- Send button

On submit: `POST /contact` to backend → backend sends email via SMTP (or just logs it for now — note in backend TODO). Show success state: checkmark animation + "Message sent! Pranav will get back to you."

Style: dark, clean, no clutter. Input fields have subtle border, focus state with Netflix red border.

---

### 8.5 BrowserApp (BrowserApp.jsx)

Fake browser chrome with:
- Top bar: traffic light buttons (already in Window chrome), URL bar (non-functional, just displays current tab's label), back/forward arrows (functional between tabs)
- Tab bar below: tabs for Experience, Education, CareerForge

**Tab: Experience**
Timeline of all work experience, most recent first:

```js
// data/experience.js
export const experience = [
  {
    id: 'njit',
    role: 'AI Engineer',
    company: 'NJIT Brain Connectivity Lab',
    detail: 'Under Dr. Bharat Biswal',
    period: 'March 2025 — Present',
    current: true,
    bullets: [
      'RAG pipeline for neuroimaging research — 31% faster document search, 18% higher QA accuracy over vanilla LLM baselines',
      'Transformer architectures for fMRI classification — 89% accuracy on cognitive state detection from 90k+ voxel time-series',
      'Attention mechanisms for brain region interpretability — 28% improvement in expert interpretability scores',
      'Integrated Neurosynth neuroimaging data with structured DNN retrievers (brain-cog-rag)',
    ],
    tech: ['PyTorch', 'Transformers', 'RAG', 'LangChain', 'fMRI', 'Python', 'LLM fine-tuning'],
  },
  {
    id: 'vandoo',
    role: 'Programmer Analyst',
    company: 'Vandoo LLC',
    detail: null,
    period: 'Nov 2024 — Feb 2025',
    current: false,
    bullets: [
      'Oracle/PL/SQL pipeline revamp — 20% query speed improvement, streamlined batch financial processing',
      'Custom Prometheus exporters for Oracle KPIs (query latency, tablespace usage)',
      'Grafana dashboards + alerting — 45% reduction in system outages',
      'AWS Lambda observability pipeline (CloudWatch + Grafana)',
    ],
    tech: ['Python', 'Oracle', 'PL/SQL', 'AWS', 'Grafana', 'Prometheus', 'PostgreSQL'],
  },
  {
    id: 'jerseystem',
    role: 'Data Scientist',
    company: 'JerseySTEM',
    detail: null,
    period: 'Feb 2024 — Nov 2024',
    current: false,
    bullets: [
      'Automated data cleaning on 1M+ records using SQL + pandas workflows',
      'Airflow pipelines on AWS EC2 — 40% reduction in manual effort, 25% operational efficiency gain',
      'Looker Studio executive dashboards for program impact and student engagement',
    ],
    tech: ['Python', 'SQL', 'Airflow', 'AWS EC2', 'Looker Studio', 'Pandas'],
  },
  {
    id: 'bayer',
    role: 'Data Engineer',
    company: 'Bayer',
    detail: null,
    period: 'Sep 2023 — Dec 2023',
    current: false,
    bullets: [
      'Databricks pipelines for Snowflake healthcare data — 3 marketing personas, 22% ROI boost',
      'PowerBI dashboards with DAX — 121+ behavior metrics visualized',
      'Azure Data Factory real-time ETL for point-of-sale data — 18% campaign performance lift',
    ],
    tech: ['Databricks', 'Spark', 'Snowflake', 'PowerBI', 'Azure Data Factory', 'Python'],
  },
  {
    id: 'dassault',
    role: 'R&D Software Engineer',
    company: 'Dassault Systèmes',
    detail: 'CATIA · C/C++ · 2.4 years',
    period: 'Apr 2020 — Jul 2022',
    current: false,
    bullets: [
      'Fixed 10+ critical memory bugs in CATIA using C/C++ — 20% crash rate reduction',
      'Led CATIA Linux migration — resolved 20+ platform errors, 40% less migration downtime',
      'Python test automation framework for CADAM — 87% faster execution, 35% more coverage',
      'Automated analytics pipeline (JSON → reports) saving 3+ hours/week',
    ],
    tech: ['C/C++', 'Python', 'Linux', 'CATIA', 'Pandas', 'Apache', 'Test automation'],
  },
  {
    id: 'nal',
    role: 'Project Assistant',
    company: 'National Aerospace Laboratories',
    detail: 'VTOL UAV',
    period: 'Dec 2019 — Mar 2020',
    current: false,
    bullets: [
      '17% VTOL UAV design efficiency improvement via CFD + Python stats on 1,500+ wind tunnel data points',
      'CATIA V5 propeller optimization — 8.5% performance improvement across 12 blueprints',
      'Stress-strain reporting automation — reduced report time from 6 hours to 45 minutes',
    ],
    tech: ['Python', 'CATIA V5', 'CFD', 'Tableau', 'Matplotlib', 'NumPy'],
  },
  {
    id: 'cognizant',
    role: 'Programmer Analyst',
    company: 'Cognizant Technology Solutions',
    detail: 'Banking',
    period: 'Dec 2018 — Oct 2019',
    current: false,
    bullets: [
      'C# transaction engine — automated exception handling, 75% less manual reconciliation, 25% faster ₹11.2M+ daily settlements',
      'Multithreading refactor — batch processing time cut from 6 hours to 4.5 hours for 50K+ records',
      '15+ stored procedures and index redesigns — 35% query latency reduction',
    ],
    tech: ['C#', '.NET', 'SQL Server', 'OOP', 'Multithreading', 'Python'],
  },
];
```

Timeline style: vertical left-border line (Netflix red), cards for each entry. Current role has red "CURRENT" badge. Clicking a card expands to show bullets and tech stack pills.

**Tab: Education**
```js
// data/education.js
export const education = [
  {
    degree: 'MS in Data Science',
    institution: 'New Jersey Institute of Technology (NJIT)',
    location: 'Newark, NJ',
    period: 'Jan 2022 — Dec 2023',
    highlights: ['GPA: focused on ML, NLP, Big Data', 'Thesis-adjacent work in neuroimaging AI'],
  },
  {
    degree: 'BE in Mechanical Engineering',
    institution: 'KLE Technological University',
    location: 'Belagavi, India',
    period: '2014 — 2018',
    highlights: [
      'Built 15 RC planes and 4 quadcopters',
      'Organized first RC plane workshop in Belagavi — 72 registrations',
      'Aerospace foundation that led to NAL and Dassault career',
    ],
  },
];
```

**Tab: CareerForge**
Just renders an iframe or redirect notice:
```jsx
<div className="flex flex-col items-center justify-center h-full gap-4">
  <p className="text-muted text-sm font-mono">Opening external link...</p>
  <a href="https://www.forge-your-future.com" target="_blank" 
     className="px-6 py-3 bg-accent text-white rounded-lg text-sm font-medium">
    Open CareerForge ↗
  </a>
  <a href="https://p-kowadkar.github.io/careerforge" target="_blank"
     className="text-muted text-xs underline">
    View Value Proposition
  </a>
</div>
```

URL bar shows the active tab's "URL" (fake):
- Experience: `pk://experience`
- Education: `pk://education`
- CareerForge: `forge-your-future.com`

---

### 8.6 TelegramApp

No window. On dock click: `window.open('https://t.me/pk_kowadkar', '_blank')`.

---

## 9. Backend (FastAPI)

### main.py
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import router as chat_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://pkowadkar.vercel.app", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"}
```

### routes/chat.py
```python
from fastapi import APIRouter
import google.generativeai as genai
from pydantic import BaseModel
import os

router = APIRouter()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class ChatRequest(BaseModel):
    message: str
    history: list[dict]  # [{role: "user"|"model", content: str}]
    system_prompt: str

@router.post("/chat")
async def chat(req: ChatRequest):
    model = genai.GenerativeModel(
        model_name="gemini-3.1-pro-preview",
        system_instruction=req.system_prompt
    )
    # Convert history to Gemini format
    history = [
        {"role": h["role"], "parts": [h["content"]]}
        for h in req.history
    ]
    chat_session = model.start_chat(history=history)
    response = chat_session.send_message(req.message)
    return {"reply": response.text}
```

### requirements.txt
```
fastapi==0.115.0
uvicorn==0.30.0
google-generativeai==0.8.0
python-dotenv==1.0.0
pydantic==2.0.0
```

### Procfile (for Render)
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### .env.example
```
GEMINI_API_KEY=your_key_here
```

---

## 10. Skills Data

Update the skills bubble system (or keep the D3 bubbles from old portfolio — just update the data):

```js
// New skills to ADD (missing from old portfolio):
const newSkills = {
  // Multi-agent & Orchestration
  "Multi-Agent Systems": { mastery: 95, description: "Hierarchical, sequential, parallel orchestration patterns" },
  "n8n": { mastery: 88, description: "Workflow automation, agent pipelines" },
  // Voice & AI interfaces
  "ElevenLabs": { mastery: 85, description: "STT (Scribe v2), TTS, Conversational AI" },
  // Frontend
  "React": { mastery: 85, description: "Component architecture, hooks, state management" },
  "TypeScript": { mastery: 80, description: "Type-safe frontend and backend development" },
  // Backend & Infra
  "FastAPI": { mastery: 92, description: "Async Python APIs, production deployment" },
  "Supabase": { mastery: 82, description: "Edge Functions, pgcrypto, RLS, real-time" },
  "Redis": { mastery: 78, description: "Caching, artifact storage, session management" },
  "Firecrawl": { mastery: 80, description: "Web scraping and search APIs" },
  // Systems
  "Rust": { mastery: 65, description: "Systems programming, performance-critical components (Smriti core)" },
};
```

---

## 11. Deployment Instructions (include as comments in code)

### Frontend → Vercel
1. Push `frontend/` to GitHub repo
2. Connect repo to Vercel, set root directory to `frontend/`
3. Build command: `npm run build`, Output: `dist`
4. Add env var: `VITE_API_URL=https://your-render-app.onrender.com`

### Backend → Render
1. Connect `backend/` folder to Render as Web Service
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add env var: `GEMINI_API_KEY=...`
5. Set up UptimeRobot: monitor `https://your-render-app.onrender.com/health` every 5 min

### Custom Domain (optional later)
Point domain to Vercel in DNS settings.

---

## 12. Build Order for Claude Code

Build in this exact sequence to avoid dependency issues:

1. **Init project** — `npm create vite@latest frontend -- --template react`, install deps
2. **Design system** — `index.css` with all CSS vars, font imports, global resets
3. **Intro screen** — `IntroScreen.jsx` (no external dependencies)
4. **Window component** — `Window.jsx` with react-rnd + macOS chrome
5. **Window manager hook** — `useWindowManager.js`
6. **Dock** — `Dock.jsx` with Framer Motion magnification
7. **Desktop** — `Desktop.jsx` wiring everything together
8. **Data files** — all `data/*.js` files (copy from this spec exactly)
9. **Apps** — Projects → Browser → Messages → ChatPK → VideoCall placeholder
10. **Backend** — FastAPI setup, `/chat` endpoint, `/health`, `/contact`
11. **Wire ChatPK** — connect frontend to backend API
12. **AchievementsWidget** — final desktop widget
13. **Test + polish** — verify all windows open/close/drag/resize correctly

---

## 13. Things NOT to Build

- No face recognition
- No actual OAuth / Google login in browser app
- No real GitHub fork functionality
- No persistence (no database for chat history — in-memory only per session)
- No authentication of any kind
- Do NOT add pages or features not listed here

---

## 14. Content Notes

- **Pranav's email:** pk.kowadkar@gmail.com
- **LinkedIn:** linkedin.com/in/pkowadkar
- **GitHub:** github.com/p-kowadkar
- **Old portfolio (reference):** p-kowadkar.github.io
- **Telegram username:** @pk_kowadkar → `https://t.me/pk_kowadkar`
- **CareerForge:** forge-your-future.com
- **CareerForge value prop:** p-kowadkar.github.io/careerforge
- **Resume PDF:** copy from old portfolio `static/Data/Pranav_Kowadkar_Resume.pdf` into `frontend/public/resume.pdf`
- **Copyright:** © 2026 Pranav Kowadkar

---

*End of spec. Build it.*
