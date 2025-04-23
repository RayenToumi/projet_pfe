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
    },
    // Nouveau champ statut avec valeur par défaut
    statut: {
        type: String,
        required: true,
        enum: ['ouvert', 'en cours', 'fermé'], // Exemple de valeurs possibles
        default: 'ouvert'
    },
    // Nouveau champ date avec valeur par défaut
    date: {
        type: Date,
        default: Date.now // Sera automatiquement rempli avec la date/heure de création
    }
}, { timestamps: true }); // Les timestamps ajoutent automatiquement createdAt et updatedAt

const Ticket = mongoose.model("Ticket", TicketSchema);
module.exports = Ticket;

