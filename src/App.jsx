import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import FeedbackForm from './pages/FeedbackForm'
import AdminPanel from './pages/AdminPanel'
import QRGenerator from './pages/QRGenerator'
import EmailSettings from './pages/EmailSettings'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/qr-generator" element={<QRGenerator />} />
        <Route path="/email-settings" element={<EmailSettings />} />
      </Routes>
    </Router>
  )
}

export default App
