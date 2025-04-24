const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
router.post('/addticket', TicketController.addTicket);
router.get('/alltickets', TicketController.getAlltickets);
module.exports = router;
