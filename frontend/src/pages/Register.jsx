import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const depts = ['BCA','BBA','B.Tech CSE','B.Tech ECE','MBA','MCA','B.Sc','Other']

export default function Register() {
  const [form, setForm] = useState({ name:'', roll_no:'', email:'', password:'', department:'BCA', role:'student' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('https://campussync-jtdq.onrender.com/api/auth/register', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div style={card}>
      <h2 style={h2}>Create Account</h2>
      {error && <p style={{color:'#e94560'}}>{error}</p>}
      <form onSubmit={submit}>
        <input style={inp} placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
        <input style={inp} placeholder="Roll Number" value={form.roll_no} onChange={e=>setForm({...form,roll_no:e.target.value})} required />
        <input style={inp} placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
        <input style={inp} placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
        <select style={inp} value={form.department} onChange={e=>setForm({...form,department:e.target.value})}>
          {depts.map(d=><option key={d}>{d}</option>)}
        </select>
        <select style={inp} value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
          <option value="student">Student</option>
          <option value="organizer">Organizer</option>
        </select>
        <button style={btn} type="submit">Register</button>
      </form>
      <p style={{color:'#aaa',marginTop:'16px'}}>Have account? <Link to="/login" style={{color:'#e94560'}}>Login</Link></p>
    </div>
  )
}
const card={maxWidth:'420px',margin:'60px auto',background:'#16213e',padding:'40px',borderRadius:'12px'}
const h2={color:'#fff',marginBottom:'24px'}
const inp={display:'block',width:'100%',padding:'10px',margin:'10px 0',borderRadius:'6px',border:'1px solid #333',background:'#0f3460',color:'#fff',boxSizing:'border-box'}
const btn={width:'100%',padding:'12px',background:'#e94560',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'16px',marginTop:'8px'}
