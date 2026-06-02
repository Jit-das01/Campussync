import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ roll_no: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('https://campussync.onrender.com/api/auth/login', form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/events')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div style={card}>
      <h2 style={h2}>Login to CampusSync</h2>
      {error && <p style={{color:'#e94560'}}>{error}</p>}
      <form onSubmit={submit}>
        <input style={inp} placeholder="Roll Number" value={form.roll_no} onChange={e=>setForm({...form,roll_no:e.target.value})} required />
        <input style={inp} type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
        <button style={btn} type="submit">Login</button>
      </form>
      <p style={{color:'#aaa',marginTop:'16px'}}>No account? <Link to="/register" style={{color:'#e94560'}}>Register</Link></p>
    </div>
  )
}
const card={maxWidth:'400px',margin:'80px auto',background:'#16213e',padding:'40px',borderRadius:'12px'}
const h2={color:'#fff',marginBottom:'24px'}
const inp={display:'block',width:'100%',padding:'10px',margin:'10px 0',borderRadius:'6px',border:'1px solid #333',background:'#0f3460',color:'#fff',boxSizing:'border-box'}
const btn={width:'100%',padding:'12px',background:'#e94560',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'16px',marginTop:'8px'}
