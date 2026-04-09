import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login.jsx'
import Chat from './components/Chat.jsx'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('atlas_token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}