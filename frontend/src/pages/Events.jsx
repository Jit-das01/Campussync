import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Events() {
  const [events, setEvents] = useState([])
  const [msg, setMsg] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get('http://localhost:5000/api/events').then(r => setEvents(r.data))
  }, [])

  const register = async (event_id) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/registrations', { event_id },
        { headers: { Authorization: `Bearer ${token}` } })
      setMsg('Registered! Check My Tickets for your QR code.')
      setEvents(ev => ev.map(e => e.id === event_id ? { ...e, seats_left: e.seats_left - 1 } : e))
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error')
    }
  }

  return (
    <div>
      <h2 style={{color:'#fff',marginBottom:'20px'}}>Upcoming Events</h2>
      {msg && <p style={{color:'#4ecca3',marginBottom:'16px'}}>{msg}</p>}
      {events.length === 0 && <p style={{color:'#aaa'}}>No events yet. Organizers can create events.</p>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'20px'}}>
        {events.map(e => (
          <div key={e.id} style={card}>
            <div style={{background:'#e94560',borderRadius:'8px 8px 0 0',padding:'10px 16px'}}>
              <span style={{color:'#fff',fontSize:'12px',fontWeight:'bold'}}>{e.department || 'ALL'}</span>
            </div>
            <div style={{padding:'16px'}}>
              <h3 style={{color:'#fff',margin:'0 0 8px'}}>{e.title}</h3>
              <p style={{color:'#aaa',fontSize:'14px',margin:'4px 0'}}>📅 {new Date(e.date).toLocaleString()}</p>
              <p style={{color:'#aaa',fontSize:'14px',margin:'4px 0'}}>📍 {e.venue}</p>
              <p style={{color:'#aaa',fontSize:'14px',margin:'4px 0'}}>👤 {e.organizer_name || 'Admin'}</p>
              <p style={{color: e.seats_left > 0 ? '#4ecca3' : '#e94560', fontSize:'14px',margin:'8px 0'}}>
                🪑 {e.seats_left} / {e.capacity} seats left
              </p>
              {e.description && <p style={{color:'#ccc',fontSize:'13px',margin:'8px 0'}}>{e.description}</p>}
              <button
                onClick={() => register(e.id)}
                disabled={e.seats_left <= 0}
                style={{...btn, background: e.seats_left > 0 ? '#e94560' : '#555', cursor: e.seats_left > 0 ? 'pointer' : 'not-allowed'}}
              >
                {e.seats_left > 0 ? 'Register Now' : 'Full'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
const card={background:'#16213e',borderRadius:'10px',overflow:'hidden',border:'1px solid #1a1a2e'}
const btn={display:'block',width:'100%',padding:'10px',color:'#fff',border:'none',borderRadius:'6px',fontSize:'15px',marginTop:'12px'}
