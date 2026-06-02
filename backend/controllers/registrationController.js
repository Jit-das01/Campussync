const db = require('../config/db');
const QRCode = require('qrcode');
exports.register = async (req, res) => {
  const { event_id } = req.body;
  const user_id = req.user.id;
  try {
    const [event] = await db.query('SELECT * FROM events WHERE id = ?', [event_id]);
    if (!event.length) return res.status(404).json({ message: 'Event not found' });
    if (event[0].seats_left <= 0) return res.status(400).json({ message: 'No seats left' });
    const qr_code = await QRCode.toDataURL(`CAMPUSSYNC|user:${user_id}|event:${event_id}|time:${Date.now()}`);
    await db.query('INSERT INTO registrations (user_id,event_id,qr_code) VALUES (?,?,?)', [user_id, event_id, qr_code]);
    await db.query('UPDATE events SET seats_left = seats_left - 1 WHERE id = ?', [event_id]);
    res.status(201).json({ message: 'Registered!', qr_code });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Already registered' });
    res.status(500).json({ message: err.message });
  }
};
exports.myRegistrations = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT r.*, e.title, e.date, e.venue FROM registrations r JOIN events e ON r.event_id = e.id WHERE r.user_id = ?', [req.user.id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.markAttended = async (req, res) => {
  try {
    await db.query('UPDATE registrations SET status = "attended" WHERE id = ?', [req.params.id]);
    res.json({ message: 'Marked as attended' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
