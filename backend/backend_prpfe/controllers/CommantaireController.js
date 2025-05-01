const Commentaire = require('../models/CommantaireSchema.js');
const mongoose = require('mongoose');

// Créer un commentaire
module.exports.createCommentaire = async (req, res) => {
  try {
    const { ticketId, commentaire } = req.body;
    const user = req.user; // Récupéré du middleware d'authentification

    // Vérifie si les informations nécessaires sont présentes
    if (!ticketId || !commentaire) {
      return res.status(400).json({
        success: false,
        message: "Données manquantes"
      });
    }

    // Si l'utilisateur n'est pas authentifié
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    // Créer un commentaire avec les données de l'utilisateur récupérées via token
    const newCommentaire = await Commentaire.create({
      ticket: ticketId,
      user: user.id, // Utilise l'ID de l'utilisateur depuis le token
      nom: user.nom, // Utilise le nom de l'utilisateur depuis le token
      prenom: user.prenom, // Utilise le prénom de l'utilisateur depuis le token
      commentaire
    });

    return res.status(201).json({
      success: true,
      data: newCommentaire
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Erreur serveur"
    });
  }
};



  
module.exports.getAllCommentaires = async (req, res) => {
  try {
    const commentaires = await Commentaire.find()
      .sort({ createdAt: -1 })
      .populate('user', 'nom prenom') // Popule le champ 'user' avec 'nom' et 'prenom'
      .select('_id ticket commentaire createdAt user'); // Sélectionne les champs nécessaires

    return res.status(200).json({
      success: true,
      data: commentaires
      .filter(com => com.user) // Ignore les commentaires sans utilisateur
      .map(com => ({
        id: com._id,
        ticket: com.ticket,
        commentaire: com.commentaire,
        nom: com.user.nom,
        prenom: com.user.prenom,
        createdAt: com.createdAt
      }))
    
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Erreur serveur"
    });
  }
};

  // CommentaireController.js
// Supprimer un commentaire
module.exports.deleteCommentaire = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Validation de l'ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "ID de commentaire invalide" 
      });
    }

    // Recherche du commentaire
    const commentaire = await Commentaire.findById(id);
    if (!commentaire) {
      return res.status(404).json({ 
        success: false, 
        message: "Commentaire non trouvé" 
      });
    }

    // Vérification des droits
    if (commentaire.user.toString() !== user.id && user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Action non autorisée" 
      });
    }

    // Suppression
    await Commentaire.findByIdAndDelete(id);

    return res.status(200).json({ 
      success: true, 
      message: "Commentaire supprimé avec succès" 
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Erreur serveur"
    });
  }
};



