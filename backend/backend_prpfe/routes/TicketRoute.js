const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
const authenticate = require('../middlewares/Authenticate'); // Importe ton middleware
router.post('/addticket', authenticate, TicketController.addTicket);
router.get('/alltickets', TicketController.getAlltickets);
router.delete('/deleteticket/:id',TicketController.deleteTicket);
router.put('/updateticket/:id',TicketController.updateTicket);
router.get('/user/:userId', TicketController.getTicketsByUser);
module.exports = router;
