const mongoose = require('mongoose');
const User = require('./UserSchema');

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
    },
    statut: {
        type: String,
        required: true,
        enum: ['ouvert', 'en cours', 'fermé'],
        default: 'ouvert'
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    technicien: { 
        type: String,  // Gardé pour compatibilité
        default: null 
    },
    technicienId: {  // Nouveau champ pour la référence
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

const Ticket = mongoose.model("Ticket", TicketSchema);
module.exports = Ticket;