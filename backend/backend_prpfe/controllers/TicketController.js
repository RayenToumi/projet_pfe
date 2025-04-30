const TicketModel = require('../models/TicketSchema');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true,  // Active le mode debug
  logger: true  // Affiche les logs dans la console
});
module.exports.addTicket = async (req, res) => {
  try {
      const { sujet, type, urgence, description } = req.body;

      // Vérifier si req.user et req.user.id existent
      if (!req.user || !req.user.id) {
        return res.status(400).json({ error: "Utilisateur non authentifié" });
      }

      const userId = req.user.id;  // L'ID de l'utilisateur est maintenant disponible ici

      const newTicket = new TicketModel({
          sujet,
          type,
          urgence,
          description,
          user: userId // Ajout de l'ID utilisateur au ticket
      });

      const ticketAdded = await newTicket.save();

      res.status(201).json({
          message: "Ticket créé avec succès",
          ticket: {
              ...ticketAdded._doc,
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
    const ticketlist = await TicketModel.find()
      .populate({
        path: 'user',
        select: 'nom prenom email'
      })
      .sort({ createdAt: -1 });

    const formattedTickets = ticketlist.map(ticket => ({
      ...ticket._doc,
      createur: {
        surnom: `${ticket.user.nom} ${ticket.user.prenom}`,
        email: ticket.user.email
      },
      date: new Date(ticket.date).toLocaleDateString('fr-FR'),
      statut: ticket.statut.charAt(0).toUpperCase() + ticket.statut.slice(1)
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
  
      // Récupère le ticket avec les informations utilisateur
      const updatedTicket = await TicketModel.findByIdAndUpdate(ticketId, updates, {
        new: true,
        runValidators: true
      }).populate('user', 'email'); // Ajout de populate pour récupérer l'email
  
      if (!updatedTicket) {
        return res.status(404).json({ message: "Ticket non trouvé" });
      }
  
      // Envoi d'email si le statut est 'fermé'
      if (updatedTicket.statut.toLowerCase() === 'fermé') {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: updatedTicket.user.email,
          subject: `Clôture du ticket : ${updatedTicket.sujet}`,
          html: `
          <div style="max-width: 600px; margin: 20px auto; font-family: 'Segoe UI', sans-serif; color: #333;">
            <div style="background: #e2e8f0; padding: 20px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0; font-size: 20px;">Notification de clôture de ticket</h2>
            </div>
      
            <div style="padding: 20px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p>Bonjour,</p>
      
              <p>Nous vous informons que votre ticket a été <strong>clôturé</strong>. Voici les détails :</p>
      
              <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Sujet :</td>
                  <td style="padding: 8px;">${updatedTicket.sujet}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Statut :</td>
                  <td style="padding: 8px;">Fermé</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Date de fermeture :</td>
                  <td style="padding: 8px;">
                    ${new Date().toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              </table>
      
              <p>Merci d’avoir utilisé notre service de support. Pour toute autre demande, n’hésitez pas à nous contacter.</p>
      
              <p style="margin-top: 30px;">Cordialement,</p>
              <p style="font-weight: 500;">L’équipe d’assistance technique</p>
              <p style="font-size: 14px; color: #6b7280;">contact@stb.tn | ✆ 71 71 00 00</p>
            </div>
      
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
              © ${new Date().getFullYear()} Votre Entreprise. Tous droits réservés.
            </div>
          </div>
          `
        };
      
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Erreur d'envoi d'email:", error);
          } else {
            console.log("Email envoyé:", info.response);
          }
        });
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
  module.exports.getTicketsByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const userTickets = await TicketModel.find({ user: userId }).sort({ createdAt: -1 });
  
      const formattedTickets = userTickets.map(ticket => ({
        ...ticket._doc,
        createdAt: ticket.createdAt.toISOString(),
        date: ticket.date.toISOString()
      }));
  
      res.status(200).json(formattedTickets);
    } catch (error) {
      res.status(500).json({
        error: "Erreur lors de la récupération des tickets utilisateur",
        details: error.message
      });
    }
  };
  