const nodemailer = require('nodemailer');
const userModal = require('../models/UserSchema');
const crypto = require('crypto'); 

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true,  // Active le mode debug
  logger: true  // Affiche les logs dans la console
});

// Obtenir tous les utilisateurs
module.exports.getAllUsers = async (req, res) => {
  try {
    const userlist = await userModal.find();
    if (!userlist) {
      throw new Error("Users not found");
    }
    res.status(200).json(userlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Ajouter un utilisateur
module.exports.addUser = async (req, res) => {
  try {
    const { nom, prenom, email, tel, role, specialite } = req.body;

    // Vérification de la présence de la spécialité si le rôle est technicien
    if (role === 'technicien' && !specialite) {
      return res.status(400).json({ error: "La spécialité est obligatoire pour un technicien." });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await userModal.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé. Veuillez en choisir un autre.' });
    }

    // Générer un mot de passe aléatoire de 10 caractères
    const rawPassword = crypto.randomBytes(5).toString('hex');

    const newUser = new userModal({
      nom,
      prenom,
      email,
      password: rawPassword,
      tel,
      role: role || 'utilisateur', // Défaut à "user" si aucun rôle n'est spécifié
      specialite: role === 'technicien' ? specialite : undefined // Ajouter la spécialité si le rôle est technicien
    });

    const userAdded = await newUser.save();

    // Envoi de l'email comme avant
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userAdded.email,
      subject: 'Votre mot de passe',
      text: `Bonjour ${userAdded.prenom},\n\nVotre compte a été créé avec succès.\nVoici votre mot de passe : ${rawPassword}\n\nMerci.`
    });

    res.status(201).json(userAdded);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Supprimer un utilisateur
module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await userModal.findByIdAndDelete(id);
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, password, tel, role } = req.body;

    const user = await userModal.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const modifications = [];
    let rawPassword = null;

    // Vérifier l'unicité de l'email
    if (email && email !== user.email) {
      const existingUser = await userModal.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email déjà utilisé" });
      }
      modifications.push(`Email: ${user.email} → ${email}`);
      user.email = email;
    }

    if (nom && nom !== user.nom) {
      modifications.push(`Nom: ${user.nom} → ${nom}`);
      user.nom = nom;
    }
    if (prenom && prenom !== user.prenom) {
      modifications.push(`Prénom: ${user.prenom} → ${prenom}`);
      user.prenom = prenom;
    }
    if (tel && tel !== user.tel) {
      modifications.push(`Téléphone: ${user.tel} → ${tel}`);
      user.tel = tel;
    }
    if (role && role !== user.role) {
      modifications.push(`Rôle: ${user.role} → ${role}`);
      user.role = role;
    }
    if (password) {
      rawPassword = password;
      modifications.push(`Mot de passe: modifié`);
      user.password = password;
    }

    const updatedUser = await user.save();

    // Email de notification si quelque chose a été modifié
    if (modifications.length > 0) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: updatedUser.email,
        subject: "Mise à jour de votre compte",
        text: `Bonjour ${updatedUser.prenom},\n\nVoici les informations de votre compte qui ont été mises à jour:\n\n${modifications.join("\n")}${rawPassword ? `\n\nNouveau mot de passe: ${rawPassword}` : ""}\n\nMerci de vérifier vos données.`,
      });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

