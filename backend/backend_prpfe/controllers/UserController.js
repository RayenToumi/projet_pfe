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
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
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
      role: role || 'utilisateur',
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
          <div style="background-color: white; padding: 25px 20px; text-align: center; border-bottom: 2px solid #004a7c;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/06/Logo_STB.png" 
                 alt="Logo STB" 
                 style="width: 250px; height: auto; display: block; margin: 0 auto;">
          </div>
    
          <div style="padding: 30px 20px;">
            <p style="color: #333; font-size: 18px; margin-bottom: 20px;">Bonjour ${userAdded.prenom},</p>
            
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #004a7c;">
              <p style="color: #004a7c; font-weight: 600; margin: 0 0 15px 0; font-size: 16px;">
                🎉 Votre compte STB a été créé avec succès
              </p>
              
              <div style="background-color: #fff8e1; padding: 15px; border-radius: 4px; margin: 15px 0;">
                <p style="color: #2c3e50; margin: 0;">
                  🔑 <strong>Identifiants de connexion :</strong>
                  <div style="margin-top: 10px;">
                    <span style="display: inline-block; background-color: white; padding: 8px 15px; 
                    border: 1px solid #ddd; font-family: 'Courier New', monospace; letter-spacing: 1px;">
                      ${rawPassword}
                    </span>
                  </div>
                </p>
              </div>
            </div>
    
            <div style="margin-top: 25px; padding: 20px; background-color: #fafafa; border-radius: 4px;">
              <p style="color: #666; line-height: 1.6; margin: 0; font-size: 14px;">
                <strong>⚠️ Sécurité du compte :</strong><br>
                1. Ne communiquez jamais votre mot de passe<br>
                2. Changez-le après votre première connexion<br>
                3. Activez la double authentification
              </p>
            </div>
          </div>
    
          <div style="background-color: #004a7c; padding: 20px; text-align: center; font-size: 12px; color: white;">
            <p style="margin: 8px 0;">
              <strong>Service Client STB</strong><br>
              ✆ <a href="tel:71710000" style="color: white; text-decoration: none;">71 71 00 00</a> | 
              ✉ <a href="mailto:contact@stb.tn" style="color: white; text-decoration: none;">contact@stb.tn</a>
            </p>
            <p style="margin: 8px 0; font-size: 11px;">
              Siège social : Rue Hédi Nouira, Tunis Centre<br>
              © ${new Date().getFullYear()} Société Tunisienne de Banque
            </p>
          </div>
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
        text: `Bonjour ${updatedUser.prenom},\n\nVoici les informations de votre compte qui ont été mises à jour:\n\n${modifications.join("\n")}${rawPassword ? `\n\nNouveau mot de passe: ${rawPassword}` : ""}\n\nMerci de vérifier vos données.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
            <div style="background-color: white; padding: 30px 20px; text-align: center; border-bottom: 2px solid #004a7c;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/06/Logo_STB.png" 
                   alt="Logo STB" 
                   style="width: 300px; height: auto; display: block; margin: 0 auto;">
            </div>
    
            <div style="padding: 30px 20px;">
              <p style="color: #333; font-size: 16px; margin-bottom: 25px;">Bonjour ${updatedUser.prenom},</p>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #004a7c;">
                <p style="color: #004a7c; font-weight: 600; margin: 0 0 12px 0; font-size: 15px;">Modifications effectuées :</p>
                <ul style="color: #555; margin: 0; padding-left: 20px; line-height: 1.6;">
                  ${modifications.map(modif => `<li style="margin-bottom: 8px;">${modif}</li>`).join('')}
                </ul>
              </div>
    
              ${rawPassword ? `
              <div style="background-color: #fff8e1; padding: 18px; border-radius: 5px; margin: 25px 0; border: 1px solid #eee;">
                <p style="color: #2c3e50; margin: 0; font-size: 14px;">
                  🔐 <strong>Identifiants de connexion temporaires :</strong><br>
                  <span style="font-family: 'Courier New', monospace; background-color: white; padding: 8px 15px; border: 1px solid #ddd; display: inline-block; margin-top: 10px; letter-spacing: 1px;">
                    ${rawPassword}
                  </span>
                </p>
                <p style="color: #7f8c8d; font-size: 12px; margin: 12px 0 0 0;">
                  (Pour des raisons de sécurité, ce mot de passe doit être modifié après votre première connexion)
                </p>
              </div>` : ''}
    
              <div style="margin-top: 30px; padding: 15px; background-color: #fafafa; border-radius: 4px;">
                <p style="color: #666; line-height: 1.6; font-size: 14px; margin: 0;">
                  ℹ️ <strong>Conseil de sécurité :</strong><br>
                  Ne communiquez jamais vos identifiants et vérifiez toujours l'URL <span style="color: #004a7c;">https://www.stb.com.tn</span> avant de vous connecter.
                </p>
              </div>
            </div>
    
            <div style="background-color: #004a7c; padding: 20px; text-align: center; font-size: 12px; color: white;">
              <p style="margin: 8px 0;">
                <strong>STB Banque de Tunisie</strong><br>
                Siège social : Rue Hédi Nouira, Tunis Centre
              </p>
              <p style="margin: 8px 0;">
                ✆ <a href="tel:71710000" style="color: white; text-decoration: none;">71 71 00 00</a> | 
                ✉ <a href="mailto:contact@stb.tn" style="color: white; text-decoration: none;">contact@stb.tn</a>
              </p>
              <p style="margin: 8px 0; font-size: 11px;">
                © ${new Date().getFullYear()} Société Tunisienne de Banque. Tous droits réservés.
              </p>
            </div>
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
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #004a7c;">🔐 Réinitialisation du mot de passe</h2>
          <p>Bonjour <strong>${user.prenom}</strong>,</p>
          <p>Voici votre <strong>nouveau mot de passe</strong> :</p>
          <div style="padding: 10px; background-color: #f1f1f1; display: inline-block; font-family: monospace; font-size: 16px;">
            ${newPassword}
          </div>
          <p style="margin-top: 20px;">Merci de le changer après votre prochaine connexion pour garantir la sécurité de votre compte.</p>
          <hr>
          <p style="font-size: 12px; color: gray;">STB - Service informatique</p>
        </div>
      `
    });

    res.status(200).json({ message: 'Mot de passe réinitialisé et envoyé par e-mail.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



