const router = require('express').Router();
const auth = require('../middleware/auth');
const { getAllEvents, getEventById, createEvent, deleteEvent } = require('../controllers/eventController');
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', auth, createEvent);
router.delete('/:id', auth, deleteEvent);
module.exports = router;
