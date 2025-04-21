const TicketModel = require('../models/TicketSchema');

module.exports.getAllTicket = async (req, res) => {
  try {
    const tickets = await TicketModel.find(); 
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.addTicket = async (req, res) => {
  try {
      // Extraire les données du corps de la requête
      const { sujet, type, urgence, description } = req.body;

      // Créer un nouveau ticket avec les données extraites
      const newTicket = new TicketModel({
          sujet,
          type,         // Utilisation de 'type' à la place de 'departement'
          urgence,      // Utilisation de 'urgence' à la place de 'priorité'
          statut: "Ouvert",  // Valeur par défaut pour le statut
          date: new Date().toLocaleDateString("fr-FR"),  // Ajouter la date au format français
          description
      });

      // Sauvegarder le ticket dans la base de données
      const ticketAdded = await newTicket.save();

      // Retourner la réponse avec le ticket ajouté
      res.status(200).json(ticketAdded);
  } catch (error) {
      // Gérer les erreurs et renvoyer un message d'erreur
      res.status(500).json({ error: error.message });
  }
};


module.exports.updateTicket = async (req, res) => {
    try {
        const{ id   }=req.params;
        const{sujet,type,statut,date,description}=req.body;


      const ticketupdate =await TicketModel.findByIdAndUpdate(id,{
        $set:{sujet,type,statut,date,description}

      })

      res.status(200).json(ticketupdate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
module.exports.deleteTicket = async (req, res) => {
    try {
        const{id}=req.params;
       const deletedticket= await  TicketModel.findByIdAndDelete(id)
      res.status(200).json(deletedticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };




