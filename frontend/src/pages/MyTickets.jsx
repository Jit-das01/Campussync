import { useEffect, useState } from 'react'
import axios from 'axios'

export default function MyTickets() {
  const [tickets, setTickets] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get('https://campussync.onrender.com/api/registrations/mine',
      { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setTickets(r.data))
  }, [])

  return (
    <div>
      <h2 style={{color:'#fff',marginBottom:'20px'}}>My Tickets</h2>
      {tickets.length === 0 && <p style={{color:'#aaa'}}>No registrations yet.</p>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:'20px'}}>
        {tickets.map(t => (
          <div key={t.id} style={card}>
            <div style={{padding:'16px',borderBottom:'1px solid #0f3460'}}>
              <h3 style={{color:'#fff',margin:'0 0 6px'}}>{t.title}</h3>
              <p style={{color:'#aaa',fontSize:'14px',margin:'4px 0'}}>📅 {new Date(t.date).toLocaleString()}</p>
              <p style={{color:'#aaa',fontSize:'14px',margin:'4px 0'}}>📍 {t.venue}</p>
              <span style={{background: t.status==='attended'?'#4ecca3':t.status==='confirmed'?'#e94560':'#888',
                color:'#fff',padding:'3px 10px',borderRadius:'20px',fontSize:'12px'}}>
                {t.status.toUpperCase()}
              </span>
            </div>
            {t.qr_code && (
              <div style={{padding:'16px',textAlign:'center'}}>
                <p style={{color:'#aaa',fontSize:'13px',marginBottom:'10px'}}>Show this QR at the venue</p>
                <img src={t.qr_code} alt="QR Ticket" style={{width:'180px',height:'180px',borderRadius:'8px'}} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
const card={background:'#16213e',borderRadius:'10px',border:'1px solid #1a1a2e'}
