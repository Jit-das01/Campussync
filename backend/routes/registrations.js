const router = require('express').Router();
const auth = require('../middleware/auth');
const { register, myRegistrations, markAttended } = require('../controllers/registrationController');
router.post('/', auth, register);
router.get('/mine', auth, myRegistrations);
router.patch('/:id/attend', auth, markAttended);
module.exports = router;
