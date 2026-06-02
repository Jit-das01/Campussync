const db = require('../config/db');
exports.getAllEvents = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT e.*, u.name as organizer_name FROM events e LEFT JOIN users u ON e.organizer_id = u.id ORDER BY e.date ASC');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.getEventById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT e.*, u.name as organizer_name FROM events e LEFT JOIN users u ON e.organizer_id = u.id WHERE e.id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Event not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.createEvent = async (req, res) => {
  const { title, description, date, venue, capacity, department } = req.body;
  try {
    await db.query('INSERT INTO events (title,description,date,venue,capacity,seats_left,department,organizer_id) VALUES (?,?,?,?,?,?,?,?)',
      [title, description, date, venue, capacity, capacity, department, req.user.id]);
    res.status(201).json({ message: 'Event created' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.deleteEvent = async (req, res) => {
  try {
    await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Event deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
