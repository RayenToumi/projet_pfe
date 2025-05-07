const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
const authenticate = require('../middlewares/Authenticate'); // Importe ton middleware
router.post('/addticket', authenticate, TicketController.addTicket);
router.get('/alltickets', authenticate,TicketController.getAlltickets);
router.get('/allticketstec',authenticate,TicketController.getTechnicianTickets);
router.delete('/deleteticket/:id', TicketController.deleteTicket);
router.put('/updateticket/:id', authenticate,TicketController.updateTicket);
router.get('/user/:userId', TicketController.getTicketsByUser);
router.get('/score',authenticate ,TicketController.getTechnicianScores);
module.exports = router;
