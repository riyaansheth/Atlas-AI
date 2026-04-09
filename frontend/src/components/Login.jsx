import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [studentId, setStudentId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleLogin() {
        if (!studentId || !password) {
            setError('Please enter both Student ID and password')
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await fetch('http://localhost:5001/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ student_id: studentId, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Login failed')
                return
            }

            localStorage.setItem('atlas_token', data.token)
            localStorage.setItem('atlas_name', data.name)
            localStorage.setItem('atlas_student_id', data.student_id)
            localStorage.setItem('atlas_program', data.program)
            localStorage.setItem('atlas_semester', data.semester)

            navigate('/chat')
        } catch (err) {
            setError('Could not connect to server. Make sure backend is running.')
        } finally {
            setLoading(false)
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') handleLogin()
    }

    return (
        <div style={styles.root}>
            <div style={styles.bg} />
            <div style={styles.card}>
                <div style={styles.logoMark}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h1 style={styles.title}>Atlas AI</h1>
                <p style={styles.subtitle}>Campus Life Assistant · ASTU</p>
                <p style={styles.desc}>Sign in with your student credentials</p>

                {error && <div style={styles.errorBox}>{error}</div>}

                <div style={styles.field}>
                    <label style={styles.label}>Student ID</label>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="e.g. STU001"
                        value={studentId}
                        onChange={e => setStudentId(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Password</label>
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <button
                    style={{
                        ...styles.loginBtn,
                        opacity: loading ? 0.6 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign In →'}
                </button>

                <p style={styles.hint}>Use your ASTU student ID and portal password</p>
            </div>

            <style>{`
        input:focus { outline: none; border-color: rgba(61,90,241,0.6) !important; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    )
}

const styles = {
    root: {
        height: '100vh',
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
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(70,100,220,0.18) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(120,60,200,0.1) 0%, transparent 60%), #080c14',
        zIndex: 0,
    },
    card: {
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(18,24,40,0.9)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '24px',
        padding: '48px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'fadeUp 0.4s ease',
    },
    logoMark: {
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #3d5af1, #6c3dce)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 30px rgba(61,90,241,0.4)',
        marginBottom: '20px',
    },
    title: {
        fontFamily: "'Syne', sans-serif",
        fontSize: '28px',
        fontWeight: 800,
        color: '#e8eaf0',
        margin: 0,
        letterSpacing: '-0.5px',
    },
    subtitle: {
        fontSize: '12px',
        color: '#4a5580',
        marginTop: '4px',
        marginBottom: '0',
        letterSpacing: '0.3px',
    },
    desc: {
        fontSize: '14px',
        color: '#5a6280',
        marginTop: '24px',
        marginBottom: '8px',
    },
    errorBox: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        background: 'rgba(255,80,80,0.1)',
        border: '1px solid rgba(255,80,80,0.25)',
        color: '#ff6b6b',
        fontSize: '13px',
        marginTop: '12px',
        textAlign: 'center',
    },
    field: {
        width: '100%',
        marginTop: '16px',
    },
    label: {
        display: 'block',
        fontSize: '12px',
        color: '#4a5580',
        marginBottom: '6px',
        fontWeight: 500,
        letterSpacing: '0.3px',
        textTransform: 'uppercase',
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(8,12,20,0.8)',
        color: '#e0e4f0',
        fontSize: '14px',
        fontFamily: "'DM Sans', sans-serif",
        boxSizing: 'border-box',
        transition: 'border-color 0.2s ease',
    },
    loginBtn: {
        width: '100%',
        marginTop: '28px',
        padding: '14px',
        borderRadius: '12px',
        border: 'none',
        background: 'linear-gradient(135deg, #3d5af1, #6c3dce)',
        color: '#fff',
        fontSize: '15px',
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: '0 4px 20px rgba(61,90,241,0.35)',
        transition: 'opacity 0.2s ease',
    },
    hint: {
        fontSize: '12px',
        color: '#2a3050',
        marginTop: '16px',
        textAlign: 'center',
    },
}