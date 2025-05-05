const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authenticate = require('../middlewares/Authenticate'); 
const User = require('../models/UserSchema');

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
module.exports = router;