const nodemailer = require('nodemailer');
const userModal = require('../models/UserSchema');
const crypto = require('crypto'); 
const bcrypt = require('bcryptjs');

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
    const generateStrongPassword = (length = 12) => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let password = '';
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };
    
    const rawPassword = generateStrongPassword();
    
  

    const newUser = new userModal({
      nom,
      prenom,
      email,
      password: rawPassword,
      tel,
      role: role || 'Client',
      specialite: role === 'technicien' ? specialite : undefined,
      actif: role === 'technicien' ? true : undefined // Ajout conditionnel de "actif"
    });

    const userAdded = await newUser.save();

    // Envoi de l'email comme avant
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userAdded.email,
      subject: 'Création de votre compte STB',
      text: `Bonjour ${userAdded.prenom},\n\nVotre compte a été créé avec succès.\nVoici votre mot de passe : ${rawPassword}\n\nMerci.`,
      html: `
     <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #d0d0d0; border-radius: 8px;">
  <h2 style="font-size: 20px; color: #004a7c; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Création de compte réussie</h2>
  
  <p style="font-size: 16px; color: #000; margin-top: 20px;">
    Bonjour ${userAdded.prenom},
  </p>
  
  <p style="font-size: 15px; color: #000;">
    Votre compte a été créé avec succès. Voici vos identifiants de connexion :
  </p>
  
  <div style="border: 1px solid #ccc; padding: 15px; border-radius: 5px; margin-top: 20px;">
    <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">Mot de passe :</p>
    <p style="font-family: monospace; font-size: 14px; background-color: #f9f9f9; padding: 8px 12px; display: inline-block; border: 1px solid #ccc;">
      ${rawPassword}
    </p>
    <p style="font-size: 12px; color: #555; margin-top: 10px;">
      Pour des raisons de sécurité, modifiez ce mot de passe lors de votre première connexion.
    </p>
  </div>
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;" />
  
  <footer style="font-size: 12px; color: #666; text-align: center;">
    <p style="margin: 5px 0;"><strong>STB Banque de Tunisie</strong></p>
    <p style="margin: 5px 0;">Rue Hédi Nouira, Tunis Centre</p>
    <p style="margin: 5px 0;">Tél : <a href="tel:71710000" style="color: #666; text-decoration: none;">71 71 00 00</a> | Email : <a href="mailto:contact@stb.tn" style="color: #666; text-decoration: none;">contact@stb.tn</a></p>
    <p style="margin: 5px 0;">© ${new Date().getFullYear()} Société Tunisienne de Banque</p>
  </footer>
</div>


      `
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
    const { nom, prenom, email, password, tel, role, actif } = req.body;

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

    // Ne mettre à jour le mot de passe que si un nouveau mot de passe est fourni
    if (password && password !== user.password) {
      rawPassword = password;
      modifications.push(`Mot de passe: modifié`);
      user.password = password; // Assurez-vous de hash le mot de passe avant de l'enregistrer
    }
    if (typeof actif === 'boolean' && actif !== user.actif) {
      modifications.push(`Statut: ${user.actif ? 'Actif' : 'Inactif'} → ${actif ? 'Actif' : 'Inactif'}`);
      user.actif = actif;
    }

    const updatedUser = await user.save();

    // Email de notification si quelque chose a été modifié
    if (modifications.length > 0) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: updatedUser.email,
        subject: "Mise à jour de votre compte STB",
        text: `Bonjour ${updatedUser.prenom},\n\nVoici les informations mises à jour pour votre compte :\n\n${modifications.join("\n")}${rawPassword ? `\n\nNouveau mot de passe : ${rawPassword}` : ""}\n\nMerci de vérifier vos données.`,
        html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #d0d0d0; border-radius: 8px;">
          <h2 style="font-size: 20px; color: #004a7c; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Notification de mise à jour</h2>
      
          <p style="font-size: 16px; color: #000; margin-top: 20px;">
            Bonjour ${updatedUser.prenom},
          </p>
      
          <p style="font-size: 15px; color: #000;">
            Les informations suivantes de votre compte ont été modifiées :
          </p>
      
          <ul style="font-size: 14px; color: #000; padding-left: 20px; line-height: 1.6; margin: 15px 0;">
            ${modifications
              .filter(modif => !modif.toLowerCase().includes("mot de passe"))
              .map(modif => `<li>${modif}</li>`)
              .join('')}
          </ul>
      
          ${rawPassword ? `
            <div style="border: 1px solid #ccc; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">Nouveau mot de passe :</p>
              <p style="font-family: monospace; font-size: 14px; background-color: #f9f9f9; padding: 8px 12px; display: inline-block; border: 1px solid #ccc;">
                ${rawPassword}
              </p>
              <p style="font-size: 12px; color: #555; margin-top: 10px;">
                Veuillez utiliser ce mot de passe lors de votre prochaine connexion.
              </p>
            </div>` : ''
          }
      
          <p style="margin-top: 30px; font-size: 13px; color: #333;">
            <strong>Conseil de sécurité :</strong><br>
            Ne partagez jamais vos identifiants et assurez-vous de toujours accéder à <a href="https://www.stb.com.tn" style="color: #004a7c; text-decoration: none;">https://www.stb.com.tn</a>
          </p>
      
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;" />
      
          <footer style="font-size: 12px; color: #666; text-align: center;">
            <p style="margin: 5px 0;"><strong>STB Banque de Tunisie</strong></p>
            <p style="margin: 5px 0;">Rue Hédi Nouira, Tunis Centre</p>
            <p style="margin: 5px 0;">Tél : <a href="tel:71710000" style="color: #666; text-decoration: none;">71 71 00 00</a> | Email : <a href="mailto:contact@stb.tn" style="color: #666; text-decoration: none;">contact@stb.tn</a></p>
            <p style="margin: 5px 0;">© ${new Date().getFullYear()} Société Tunisienne de Banque</p>
          </footer>
        </div>
      `
      
        
        
        
        
        
      });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const jwt = require("jsonwebtoken")
const createToken=(id)=>{
  return jwt.sign({id},'net stbticket 2025',{expiresIn : '1m'})
}
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await userModal.login(email, password);
    const connecte = true;
    
    await userModal.findByIdAndUpdate(user._id, { $set: { connecte } });
    
    // Modifier la durée ici (ex: 1 heure)
    const token = jwt.sign({
      id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      specialite: user.specialite // ✅ Ajout ici
    }, 'secret-key', { expiresIn: '1d' });
    
    // Corriger la configuration du cookie
    res.cookie('jwt_token', token, { 
      httpOnly: true,
      maxAge: 60 * 60 * 1000 // 1 heure en millisecondes
    });
    
    res.status(200).json({
      message: "connected",
      token: token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        nom: user.nom,
        prenom: user.prenom,
        tel: user.tel
        // Ne jamais envoyer le mot de passe même hashé
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const { id } = req.params;
    const connecte = false;
    await userModal.findByIdAndUpdate(id, { 
      $set: { connecte }
    });
    res.cookie("jwt_token","",{httpOnly:false,maxAge:1})
    res.status(200).json("User successfully logged out");
  } catch (error) {
    res.status(500).json({message:error.message});
  }
}
module.exports.resetPasswordByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModal.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Aucun utilisateur trouvé avec cet email.' });
    }

    const generateStrongPassword = (length = 12) => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      let password = '';
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };
    
    const newPassword = generateStrongPassword();
    
    // Ne pas hasher manuellement ici
    user.password = newPassword;
    await user.save(); // Le hook hash automatiquement

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Réinitialisation de votre mot de passe STB',
      html: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #d0d0d0; border-radius: 8px;">
  <h2 style="font-size: 20px; color: #004a7c; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Réinitialisation du mot de passe</h2>
  
  <p style="font-size: 16px; color: #000; margin-top: 20px;">
    Bonjour <strong>${user.prenom}</strong>,
  </p>
  
  <p style="font-size: 15px; color: #000;">
    Voici votre <strong>nouveau mot de passe</strong> :
  </p>
  
  <div style="border: 1px solid #ccc; padding: 15px; border-radius: 5px; margin-top: 20px;">
    <p style="font-family: monospace; font-size: 14px; background-color: #f9f9f9; padding: 8px 12px; display: inline-block; border: 1px solid #ccc;">
      ${newPassword}
    </p>
    <p style="font-size: 12px; color: #555; margin-top: 10px;">
      Pour des raisons de sécurité, nous vous conseillons de modifier ce mot de passe après votre prochaine connexion.
    </p>
  </div>
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;" />
  
  <footer style="font-size: 12px; color: #666; text-align: center;">
    <p style="margin: 5px 0;"><strong>STB - Service informatique</strong></p>
  </footer>
</div>

      `
    });

    res.status(200).json({ message: 'Mot de passe réinitialisé et envoyé par e-mail.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



