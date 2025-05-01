const express = require('express');
const router = express.Router();
const CommentaireController = require('../controllers/CommantaireController');
const authenticate = require('../middlewares/Auth'); // Middleware d'auth

// Créer un commentaire
router.post('/addcom', authenticate, CommentaireController.createCommentaire);

// Récupérer les commentaires d'un ticket
router.get("/getcom", CommentaireController.getAllCommentaires);
router.delete('/deletecom/:id', authenticate, CommentaireController.deleteCommentaire);



module.exports = router;

