const db = require('../config/db');

exports.getAllEvents = async (req, res) => {
  try {
    const result = await db.query('SELECT e.*, u.name as organizer_name FROM events e LEFT JOIN users u ON e.organizer_id = u.id ORDER BY e.date ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getEventById = async (req, res) => {
  try {
    const result = await db.query('SELECT e.*, u.name as organizer_name FROM events e LEFT JOIN users u ON e.organizer_id = u.id WHERE e.id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Event not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createEvent = async (req, res) => {
  const { title, description, date, venue, capacity, department } = req.body;
  try {
    await db.query(
      'INSERT INTO events (title,description,date,venue,capacity,seats_left,department,organizer_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [title, description, date, venue, capacity, capacity, department, req.user.id]
    );
    res.status(201).json({ message: 'Event created' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteEvent = async (req, res) => {
  try {
    await db.query('DELETE FROM events WHERE id = $1', [req.params.id]);
    res.json({ message: 'Event deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
