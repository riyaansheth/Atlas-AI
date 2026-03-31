# Atlas AI – Campus Life Assistant

> An AI-powered campus assistant for Atlas SkillTech University students, built with Node.js, Express, React (Vite), and Groq AI (LLaMA 3.3).

---

##Project Structure

atlas-ai/
├── backend/
│   ├── index.js              # Express server entry point
│   ├── gemini.js             # Groq AI integration + system prompt
│   └── routes/
│       └── chat.js           # POST /api/chat endpoint
├── frontend/
│   ├── index.html            # HTML entry point
│   ├── vite.config.js        # Vite configuration
│   ├── package.json          # Frontend dependencies
│   └── src/
│       ├── main.jsx          # React entry point
│       ├── App.jsx           # Root component
│       └── components/
│           └── Chat.jsx      # Full chat UI component
├── .env                      # Environment variables (not committed)
├── .env.example              # Environment variable template
├── package.json              # Backend dependencies
└── README.md                 # This file
```

---

## ⚙️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite 5                  |
| Backend   | Node.js, Express.js               |
| AI Model  | LLaMA 3.3 70B via Groq API        |
| Styling   | Inline CSS (no external library)  |
| Fonts     | Syne + DM Sans (Google Fonts)     |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js v18 or higher
- npm v9 or higher

Check versions:
```bash
node -v
npm -v
```

---

### 1. Get a Free Groq API Key

1. Go to → [https://console.groq.com](https://console.groq.com)
2. Sign up / Log in
3. Click **API Keys** → **Create API Key**
4. Copy the key (starts with `gsk_...`)

---

### 2. Clone / Extract the Project

```bash
unzip atlas-ai.zip
cd atlas-ai
```

---

### 3. Set Up Environment Variables

```bash
cp .env.example .env
nano .env
```

Add your Groq API key:
```
GROQ_API_KEY=gsk_your_actual_key_here
PORT=5000
```

Save: `Ctrl+O` → `Enter` → `Ctrl+X`

---

### 4. Install Dependencies

```bash
# Backend dependencies (from root)
npm install

# Frontend dependencies
cd frontend && npm install && cd ..
```

---

### 5. Run the Backend

Open **Terminal 1** and run:

```bash
cd ~/atlas-ai/backend
node index.js
```

Expected output:
```
Atlas AI server running on http://localhost:5000
```

---

### 6. Run the Frontend

Open **Terminal 2** and run:

```bash
cd ~/atlas-ai/frontend
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

---

### 7. Open in Browser

```
http://localhost:3000
```

---

## 🔌 API Reference

### POST `/api/chat`

Send a message to the AI assistant.

**Request:**
```json
{
  "message": "Is the library open right now?"
}
```

**Response:**
```json
{
  "reply": "Yes! The library is open right now. It operates Mon–Sat from 8:00 AM to 9:00 PM..."
}
```

**Error Response:**
```json
{
  "error": "Message is required."
}
```

---

## 🧠 AI Capabilities

The assistant is trained on Atlas SkillTech University data and can answer questions about:

- 📅 Academic schedule, lectures, and lab timings
- 🏛️ Campus facilities and operating hours
- 🎓 Clubs, events, and student organizations
- 💼 Placements, internships, and career resources
- 🏠 Hostel info, fees, and policies
- 📋 Attendance rules and academic calendar
- 🔗 Important portals and contact information

The AI is **time-aware** — every query includes the current day and IST time so it can answer questions like *"Is the cafeteria open right now?"* or *"What lecture is next?"* accurately.

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---|---|
| `GROQ_API_KEY` not found | Make sure `.env` is inside the `backend/` folder |
| Port 5000 already in use | Change `PORT=5001` in `.env` |
| Port 3000 already in use | Change port in `frontend/vite.config.js` |
| Frontend can't reach backend | Make sure backend is running on port 5000 |
| `npm install` fails | Run `node -v` and ensure Node.js v18+ is installed |

---

## 📜 License

Built for Atlas SkillTech University — Academic Project.
