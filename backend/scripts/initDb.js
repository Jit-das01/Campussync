require('dotenv').config();
const pool = require('../config/db');

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      roll_no VARCHAR(50) UNIQUE,
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      department VARCHAR(100),
      role VARCHAR(20) DEFAULT 'student'
    );
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200),
      description TEXT,
      date DATE,
      venue VARCHAR(200),
      capacity INT,
      seats_left INT,
      department VARCHAR(100),
      organizer_id INT REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      event_id INT REFERENCES events(id),
      qr_code TEXT,
      status VARCHAR(20) DEFAULT 'registered',
      UNIQUE(user_id, event_id)
    );
  `);
  console.log('Tables created!');
  process.exit();
}
init().catch(console.error);
