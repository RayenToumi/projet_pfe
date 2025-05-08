const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

const authenticate = require('../middlewares/Authenticate'); 
const User = require('../models/UserSchema');
const Ticket = require('../models/TicketSchema');
const Commentaire = require('../models/CommantaireSchema');

router.get('/allusers', UserController.getAllUsers);
router.post('/adduser',UserController.addUser);
router.delete('/deleteuser/:id',UserController.deleteUser);
router.put('/updateuser/:id',UserController.updateUser);
router.post('/login',UserController.login);
router.post('/logout/:id',UserController.logout);
router.get('/me', authenticate, async (req, res) => {
    try {
      console.log('ID utilisateur :', req.user.id); // debug
  
      // Ajout de `tel` dans la sélection des champs
      const user = await User.findById(req.user.id).select('nom prenom email password tel');
  
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
  
      res.json({
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        password: user.password,
        tel: user.tel // ✅ envoyé dans la réponse
      });
    } catch (error) {
      console.error('Erreur dans /me :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });
router.post('/reset-password',UserController.resetPasswordByEmail);
router.get('/stats', async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ statut: 'ouvert' });
    const closedTickets = await Ticket.countDocuments({ statut: 'fermé' });
    const pendingTickets = await Ticket.countDocuments({ statut: 'en cours' });

    const totalUsers = await User.countDocuments();
    const techniciens = await User.countDocuments({ role: 'technicien' });
    const techniciensActifs = await User.countDocuments({ role: 'technicien', actif: true });
    const techniciensInactifs = await User.countDocuments({ role: 'technicien', actif: false });

    const admins = await User.countDocuments({ role: 'admin' });
    const utilisateurs = await User.countDocuments({ role: 'utilisateur' });

    const totalCom = await Commentaire.countDocuments(); // 👈 Ajout du nombre total de commentaires

    res.json({
      totalTickets,
      openTickets,
      closedTickets,
      pendingTickets,
      totalUsers,
      techniciens,
      techniciensActifs,
      techniciensInactifs,
      admins,
      utilisateurs,
      totalCom, // 👈 Inclusion dans la réponse JSON
    });
  } catch (err) {
    console.error('Erreur stats :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


module.exports = router;