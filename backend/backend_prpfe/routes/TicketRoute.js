const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
router.get('/getticket', TicketController.getAllTicket);
router.post('/addticket', TicketController.addTicket);
router.put('/upticket/:id', TicketController.updateTicket);
router.delete('/deleteticket/:id', TicketController.deleteTicket);
module.exports = router;
