import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const depts = ['ALL','BCA','BBA','B.Tech CSE','B.Tech ECE','MBA','MCA','B.Sc','Other']

export default function CreateEvent() {
  const [form, setForm] = useState({ title:'', description:'', date:'', venue:'', capacity:100, department:'ALL' })
  const [msg, setMsg] = useState('')
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('https://campussync-jtdq.onrender.com/api/events', form,
        { headers: { Authorization: `Bearer ${token}` } })
      setMsg('Event created!')
      setTimeout(() => navigate('/events'), 1500)
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error creating event')
    }
  }

  return (
    <div style={card}>
      <h2 style={{color:'#fff',marginBottom:'24px'}}>Create New Event</h2>
      {msg && <p style={{color:'#4ecca3'}}>{msg}</p>}
      <form onSubmit={submit}>
        <input style={inp} placeholder="Event Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
        <textarea style={{...inp,height:'80px',resize:'vertical'}} placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
        <input style={inp} type="datetime-local" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required />
        <input style={inp} placeholder="Venue" value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})} required />
        <input style={inp} type="number" placeholder="Capacity" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})} required />
        <select style={inp} value={form.department} onChange={e=>setForm({...form,department:e.target.value})}>
          {depts.map(d=><option key={d}>{d}</option>)}
        </select>
        <button style={btn} type="submit">Create Event</button>
      </form>
    </div>
  )
}
const card={maxWidth:'480px',margin:'40px auto',background:'#16213e',padding:'40px',borderRadius:'12px'}
const inp={display:'block',width:'100%',padding:'10px',margin:'10px 0',borderRadius:'6px',border:'1px solid #333',background:'#0f3460',color:'#fff',boxSizing:'border-box'}
const btn={width:'100%',padding:'12px',background:'#e94560',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'16px',marginTop:'8px'}
