const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
router.post('/addticket', TicketController.addTicket);
router.get('/alltickets', TicketController.getAlltickets);
router.delete('/deleteticket/:id',TicketController.deleteTicket);
router.put('/updateticket/:id',TicketController.updateTicket);
module.exports = router;
