const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
router.post('/addticket', TicketController.addTicket);
module.exports = router;
