const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, roll_no, email, password, department, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name,roll_no,email,password,department,role) VALUES ($1,$2,$3,$4,$5,$6)',
      [name, roll_no, email, hash, department, role || 'student']
    );
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.login = async (req, res) => {
  const { roll_no, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE roll_no = $1', [roll_no]);
    if (!result.rows.length) return res.status(404).json({ message: 'User not found' });
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Wrong password' });
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, department: user.department } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
