import { useState, useRef, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api/chat'

const SUGGESTIONS = [
  'What time does the library close today?',
  'When is the next placement drive?',
  'What clubs can I join this semester?',
  'Is the cafeteria open right now?',
  'What is the attendance requirement?',
  'Tell me about upcoming campus events',
]

function TypingDots() {
  return (
    <div style={styles.typingWrapper}>
      <div style={styles.typingDot(0)} />
      <div style={styles.typingDot(1)} />
      <div style={styles.typingDot(2)} />
    </div>
  )
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{ ...styles.messageRow, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && (
        <div style={styles.avatar}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#7c9ef8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      <div style={isUser ? styles.userBubble : styles.aiBubble}>
        {msg.content.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < msg.content.split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hey there! 👋 I'm Atlas, your campus life assistant at Atlas SkillTech University.\n\nAsk me anything — schedules, facilities, clubs, placements, or campus life. I'm here to help!",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text) {
    const userText = (text || input).trim()
    if (!userText || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userText }])
    setLoading(true)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server error')
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: `⚠️ Sorry, I couldn't connect right now. Please check your connection or try again.\n\n(${err.message})` },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const showSuggestions = messages.length === 1 && !loading

  return (
    <div style={styles.root}>
      <div style={styles.bg} />
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.logoMark}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={styles.logoText}>Atlas AI</div>
              <div style={styles.logoSub}>Campus Life Assistant · ASTU</div>
            </div>
          </div>
          <div style={styles.statusPill}>
            <span style={styles.statusDot} />
            Online
          </div>
        </header>

        <div style={styles.messagesArea}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
          {loading && (
            <div style={{ ...styles.messageRow, justifyContent: 'flex-start' }}>
              <div style={styles.avatar}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#7c9ef8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.aiBubble}>
                <TypingDots />
              </div>
            </div>
          )}
          {showSuggestions && (
            <div style={styles.suggestionsSection}>
              <div style={styles.suggestionsLabel}>Quick questions</div>
              <div style={styles.suggestionsGrid}>
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} style={styles.suggestionBtn} onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={styles.inputArea}>
          <div style={styles.inputWrapper}>
            <textarea
              ref={inputRef}
              style={styles.textarea}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about campus life…"
              rows={1}
              disabled={loading}
            />
            <button
              style={{
                ...styles.sendBtn,
                opacity: !input.trim() || loading ? 0.4 : 1,
                cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
              }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22 11 13 2 9l20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div style={styles.inputHint}>Press Enter to send · Shift+Enter for new line</div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        textarea:focus { outline: none; }
        textarea::placeholder { color: #4a5168; }
        textarea { resize: none; scrollbar-width: none; }
        textarea::-webkit-scrollbar { display: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e2435; border-radius: 2px; }
      `}</style>
    </div>
  )
}

const styles = {
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(70, 100, 220, 0.18) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(120, 60, 200, 0.1) 0%, transparent 60%), #080c14',
    zIndex: 0,
  },
  container: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '760px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid rgba(255,255,255,0.05)',
    borderRight: '1px solid rgba(255,255,255,0.05)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(8,12,20,0.8)',
    backdropFilter: 'blur(20px)',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  logoMark: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #3d5af1, #6c3dce)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(61,90,241,0.4)',
  },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: '17px',
    color: '#e8eaf0',
    letterSpacing: '-0.3px',
  },
  logoSub: {
    fontSize: '11px',
    color: '#4a5580',
    fontWeight: 400,
    marginTop: '1px',
    letterSpacing: '0.2px',
  },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 12px',
    borderRadius: '20px',
    background: 'rgba(40,200,100,0.08)',
    border: '1px solid rgba(40,200,100,0.2)',
    fontSize: '12px',
    color: '#4dbe80',
    fontWeight: 500,
  },
  statusDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#4dbe80',
    animation: 'pulse 2s ease-in-out infinite',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '10px',
    animation: 'fadeUp 0.25s ease',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, rgba(61,90,241,0.2), rgba(108,61,206,0.2))',
    border: '1px solid rgba(124,158,248,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userBubble: {
    maxWidth: '72%',
    padding: '12px 16px',
    borderRadius: '18px 18px 4px 18px',
    background: 'linear-gradient(135deg, #3d5af1, #6c3dce)',
    color: '#fff',
    fontSize: '14.5px',
    lineHeight: '1.6',
    fontWeight: 400,
    boxShadow: '0 4px 16px rgba(61,90,241,0.25)',
  },
  aiBubble: {
    maxWidth: '78%',
    padding: '12px 16px',
    borderRadius: '18px 18px 18px 4px',
    background: 'rgba(18,24,40,0.9)',
    border: '1px solid rgba(255,255,255,0.07)',
    color: '#ccd0e0',
    fontSize: '14.5px',
    lineHeight: '1.7',
    fontWeight: 400,
  },
  typingWrapper: {
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
    padding: '4px 2px',
  },
  typingDot: (i) => ({
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#4a6ae8',
    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
  }),
  suggestionsSection: {
    marginTop: '8px',
    animation: 'fadeUp 0.35s ease',
  },
  suggestionsLabel: {
    fontSize: '11px',
    color: '#3a4060',
    fontWeight: 500,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    marginBottom: '10px',
    paddingLeft: '4px',
  },
  suggestionsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  suggestionBtn: {
    padding: '8px 14px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(18,24,40,0.6)',
    color: '#8899cc',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.15s ease',
    lineHeight: 1.4,
  },
  inputArea: {
    padding: '16px 20px 20px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(8,12,20,0.85)',
    backdropFilter: 'blur(20px)',
    flexShrink: 0,
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '10px',
    background: 'rgba(18,24,40,0.9)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '16px',
    padding: '10px 10px 10px 16px',
  },
  textarea: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#e0e4f0',
    fontSize: '14.5px',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: '1.5',
    maxHeight: '120px',
    overflowY: 'auto',
    padding: '4px 0',
  },
  sendBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #3d5af1, #6c3dce)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'opacity 0.2s ease',
  },
  inputHint: {
    marginTop: '8px',
    fontSize: '11px',
    color: '#2a3050',
    textAlign: 'center',
    letterSpacing: '0.2px',
  },
}
