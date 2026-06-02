const db = require('../config/db');
const QRCode = require('qrcode');

exports.register = async (req, res) => {
  const { event_id } = req.body;
  const user_id = req.user.id;
  try {
    const event = await db.query('SELECT * FROM events WHERE id = $1', [event_id]);
    if (!event.rows.length) return res.status(404).json({ message: 'Event not found' });
    if (event.rows[0].seats_left <= 0) return res.status(400).json({ message: 'No seats left' });
    const qr_code = await QRCode.toDataURL(`CAMPUSSYNC|user:${user_id}|event:${event_id}|time:${Date.now()}`);
    await db.query('INSERT INTO registrations (user_id,event_id,qr_code) VALUES ($1,$2,$3)', [user_id, event_id, qr_code]);
    await db.query('UPDATE events SET seats_left = seats_left - 1 WHERE id = $1', [event_id]);
    res.status(201).json({ message: 'Registered!', qr_code });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ message: 'Already registered' });
    res.status(500).json({ message: err.message });
  }
};

exports.myRegistrations = async (req, res) => {
  try {
    const result = await db.query('SELECT r.*, e.title, e.date, e.venue FROM registrations r JOIN events e ON r.event_id = e.id WHERE r.user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.markAttended = async (req, res) => {
  try {
    await db.query('UPDATE registrations SET status = $1 WHERE id = $2', ['attended', req.params.id]);
    res.json({ message: 'Marked as attended' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
