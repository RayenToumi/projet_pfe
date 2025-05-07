const jwt = require('jsonwebtoken');


const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Accès non autorisé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, 'secret-key');

    if (!decoded.nom || !decoded.prenom) {
      return res.status(401).json({ error: 'Technicien non authentifié ou surnom manquant' });
    }

    req.user = {
      id: decoded.id,
      nom: decoded.nom,
      prenom: decoded.prenom,
      role: decoded.role,
      surnom: `${decoded.nom} ${decoded.prenom}`,
      specialite: decoded.specialite // ✅ AJOUT ICI
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};



module.exports = authenticate;