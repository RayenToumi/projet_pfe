const mongoose = require('mongoose');
const User = require('./UserSchema');  // Import du modèle User ici

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
        ref: 'User',  // 'User' fait référence au modèle déjà défini dans UserSchema
        required: true
    }
}, { timestamps: true });

const Ticket = mongoose.model("Ticket", TicketSchema);
module.exports = Ticket;