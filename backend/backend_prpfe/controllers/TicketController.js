const TicketModel = require('../models/TicketSchema');
const UserModel = require('../models/UserSchema');
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
    const { role, specialite } = req.user;
    console.log("DEBUG USER:", req.user); // <— pour vérifier que specialite est présent

    let query = {};

    if (role === 'technicien') {
      if (!specialite) {
        return res.status(400).json({ error: "Technicien sans spécialité définie." });
      }

      const mapping = {
        IT: 'Informatique',
        NET: 'reseaux',
        DAB: 'DAB',
        SC: 'support'
      };

      // Types de tickets compatibles avec la spécialité
      const typesCompatibles = Object
        .entries(mapping)
        .filter(([code, libelle]) => libelle.toLowerCase() === specialite.toLowerCase())
        .map(([code]) => code);

      if (typesCompatibles.length === 0) {
        // Aucun type compatible
        return res.status(200).json([]);
      }

      query.type = { $in: typesCompatibles };
    }

    const ticketlist = await TicketModel.find(query)
      .populate({
        path: 'user',
        select: 'nom prenom email'
      })
      .sort({ createdAt: -1 });

    const formattedTickets = ticketlist.map(ticket => {
      const createur = ticket.user
        ? {
            surnom: `${ticket.user.nom} ${ticket.user.prenom}`,
            email: ticket.user.email
          }
        : {
            surnom: "Utilisateur supprimé",
            email: "N/A"
          };

      return {
        ...ticket._doc,
        createur,
        date: new Date(ticket.date).toLocaleDateString('fr-FR'),
        statut: ticket.statut.charAt(0).toUpperCase() + ticket.statut.slice(1)
      };
    });

    res.status(200).json(formattedTickets);
  } catch (error) {
    console.error("Erreur dans getAlltickets :", error);
    res.status(500).json({ error: error.message });
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
  
      if (!req.user || !req.user.surnom) {
        return res.status(400).json({ error: "Technicien non authentifié ou surnom manquant" });
      }
      if (updates.statut && (updates.statut === 'en cours' || updates.statut === 'fermé')) {
        updates.technicien = `${req.user.nom} ${req.user.prenom}`; // Ancien format
        updates.technicienId = req.user.id; // Nouveau format
      }
  
     
  
      const surnomTechnicien = req.user.surnom;
  
      // Ajouter automatiquement le technicien si le statut change vers en cours ou fermé
      if (updates.statut && (updates.statut === 'en cours' || updates.statut === 'fermé')) {
        updates.technicien = surnomTechnicien;
      }
  
      const updatedTicket = await TicketModel.findByIdAndUpdate(ticketId, updates, {
        new: true,
        runValidators: true
      }).populate('user', 'email');
  
      if (!updatedTicket) {
        return res.status(404).json({ message: "Ticket non trouvé" });
      }
  
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
  module.exports.getTechnicianTickets = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const tickets = await TicketModel.find({
        technicienId: userId, // Recherche par le nouvel ID
        statut: { $in: ['en cours', 'fermé'] }
      })
      .populate({
        path: 'user',
        select: 'nom prenom email'
      })
      .populate({
        path: 'technicienId',
        select: 'nom prenom'
      })
      .sort({ datePrise: -1 });
  
      if(tickets.length === 0) {
        return res.status(404).json({
          message: "Aucun ticket trouvé pour ce technicien"
        });
      }
  
      const formattedTickets = tickets.map(ticket => ({
        _id: ticket._id,
        sujet: ticket.sujet,
        type: ticket.type,
        urgence: ticket.urgence,
        description: ticket.description,
        createur: {
          surnom: ticket.user ? `${ticket.user.nom} ${ticket.user.prenom}` : "Utilisateur supprimé",
          email: ticket.user?.email || "N/A"
        },
        technicien: ticket.technicienId ? 
          `${ticket.technicienId.nom} ${ticket.technicienId.prenom}` : 
          ticket.technicien || "Non assigné",
        date: new Date(ticket.date).toLocaleDateString('fr-FR'),
        statut: ticket.statut.charAt(0).toUpperCase() + ticket.statut.slice(1),
        datePrise: ticket.datePrise ? new Date(ticket.datePrise).toLocaleString('fr-FR') : null
      }));
  
      res.status(200).json(formattedTickets);
  
    } catch (error) {
      res.status(500).json({
        error: "Erreur de récupération des tickets",
        details: error.message
      });
    }
  };
  module.exports.getTechnicianScores = async (req, res) => {
    try {
      // Vérifie que l'utilisateur est admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Accès refusé" });
      }
  
      // Récupère tous les techniciens
      const technicians = await UserModel.find({ role: 'technicien' });
  
      // Pour chaque technicien, calcule le score
      const result = await Promise.all(technicians.map(async (tech) => {
        const tickets = await TicketModel.find({
          technicienId: tech._id,
          statut: { $in: ['en cours', 'fermé'] }
        });
  
        const closedCount = tickets.filter(t => t.statut === 'fermé').length;
        const inProgressCount = tickets.filter(t => t.statut === 'en cours').length;
        const totalTickets = closedCount + inProgressCount;
  
        const score = totalTickets > 0 ? (closedCount / totalTickets) : 0;
  
        return {
          id: tech._id,
          nom: tech.nom,
          prenom: tech.prenom,
          specialite: tech.specialite,
          statut: tech.statut,
          score: `${(score * 100).toFixed(1).replace(/\.0$/, '')}%`
        };
      }));
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  };
  
  
  
  

