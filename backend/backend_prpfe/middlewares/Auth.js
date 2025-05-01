const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema'); // Assure-toi que ce chemin est correct

const auth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Accès non autorisé, token manquant' });
    }

    try {
        const decoded = jwt.verify(token, 'secret-key'); // Vérifie le token
        const user = await User.findById(decoded.id);  // Recherche l'utilisateur dans la DB

        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        req.user = { 
            id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            role: user.role // 👈 AJOUTER CECI
        };
        
        next();

    } catch (error) {
        res.status(401).json({ error: 'Token invalide ou expiré' });
    }
};

module.exports = auth;
