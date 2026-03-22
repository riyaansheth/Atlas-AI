# Atlas AI – Campus Life Assistant

## Project Structure
```
atlas-ai/
├── backend/
│   ├── index.js
│   ├── gemini.js
│   └── routes/
│       └── chat.js
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       └── components/
│           └── Chat.jsx
├── .env.example
└── package.json
```

## Setup

### 1. Create your .env file
```bash
cp .env.example .env
```
Edit `.env` and add your Gemini API key (get one free at https://aistudio.google.com/app/apikey):
```
GEMINI_API_KEY=your_actual_key_here
```

### 2. Install dependencies
```bash
npm install
cd frontend && npm install && cd ..
```

### 3. Run backend (Terminal 1)
```bash
npm start
```

### 4. Run frontend (Terminal 2)
```bash
cd frontend && npm run dev
```

### 5. Open browser
```
http://localhost:3000
```
