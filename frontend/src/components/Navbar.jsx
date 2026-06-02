import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <nav style={{background:'#1a1a2e',padding:'14px 30px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <Link to="/events" style={{color:'#e94560',fontWeight:'bold',fontSize:'22px',textDecoration:'none'}}>🎓 CampusSync</Link>
      <div style={{display:'flex',gap:'20px',alignItems:'center'}}>
        {user ? (
          <>
            <Link to="/events" style={nl}>Events</Link>
            <Link to="/my-tickets" style={nl}>My Tickets</Link>
            {(user.role === 'organizer' || user.role === 'admin') &&
              <Link to="/create-event" style={nl}>+ Create Event</Link>}
            <span style={{color:'#aaa',fontSize:'14px'}}>Hi, {user.name}</span>
            <button onClick={logout} style={{background:'#e94560',color:'#fff',border:'none',padding:'6px 14px',borderRadius:'6px',cursor:'pointer'}}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={nl}>Login</Link>
            <Link to="/register" style={nl}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
const nl = {color:'#ccc',textDecoration:'none',fontSize:'15px'}
