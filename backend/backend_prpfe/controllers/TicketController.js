const TicketModel = require('../models/TicketSchema');

module.exports.addTicket = async (req, res) => {
  try {
      const { sujet, type, urgence, description } = req.body;

      const newTicket = new TicketModel({
          sujet,
          type,
          urgence,
          description
          // Les champs 'statut' et 'date' seront gérés automatiquement par le schéma
      });

      const ticketAdded = await newTicket.save();

      res.status(201).json({ // 201 Created pour création réussie
          message: "Ticket créé avec succès",
          ticket: {
              ...ticketAdded._doc,
              // Formatage de la date pour l'affichage (optionnel)
              date: ticketAdded.date.toLocaleDateString("fr-FR"),
              createdAt: ticketAdded.createdAt.toLocaleDateString("fr-FR")
          }
      });
  } catch (error) {
      res.status(500).json({ 
          error: "Erreur lors de la création du ticket",
          details: error.message 
      });
  }
};