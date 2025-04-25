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
module.exports.getAlltickets = async (req, res) => {
    try {
      const ticketlist = await TicketModel.find().sort({ createdAt: -1 });
      if (!ticketlist) {
        throw new Error("Aucun ticket trouvé");
      }
      
      // Formatez les dates pour le frontend
      const formattedTickets = ticketlist.map(ticket => ({
        ...ticket._doc,
        createdAt: ticket.createdAt.toISOString(),
        date: ticket.date.toISOString()
      }));
      
      res.status(200).json(formattedTickets);
    } catch (error) {
      res.status(500).json({ 
        error: error.message 
      });
    }
  };
  module.exports.deleteTicket = async (req, res) => {
    try {
      const ticketId = req.params.id;
      const deletedTicket = await TicketModel.findByIdAndDelete(ticketId);
  
      if (!deletedTicket) {
        return res.status(404).json({ message: "Ticket non trouvé" });
      }
      res.status(200).json({ message: "Ticket supprimé avec succès" });
    } catch (error) {
      res.status(500).json({
        error: "Erreur lors de la suppression du ticket",
        details: error.message
      });
    }
  };
  // Mettre à jour un ticket par ID
  module.exports.updateTicket = async (req, res) => {
    try {
      const ticketId = req.params.id;
      const updates = req.body;
  
      const updatedTicket = await TicketModel.findByIdAndUpdate(ticketId, updates, {
        new: true,
        runValidators: true
      });
  
      if (!updatedTicket) {
        return res.status(404).json({ message: "Ticket non trouvé" });
      }
  
      res.status(200).json({
        message: "Ticket mis à jour avec succès",
        ticket: {
          ...updatedTicket._doc,
          date: updatedTicket.date.toLocaleDateString("fr-FR"),
          createdAt: updatedTicket.createdAt.toLocaleDateString("fr-FR")
        }
      });
    } catch (error) {
      res.status(500).json({
        error: "Erreur lors de la mise à jour du ticket",
        details: error.message
      });
    }
  };