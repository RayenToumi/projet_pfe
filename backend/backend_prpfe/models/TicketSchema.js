const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    sujet: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    urgence: {  
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Ticket = mongoose.model("Ticket", TicketSchema);
module.exports = Ticket;

