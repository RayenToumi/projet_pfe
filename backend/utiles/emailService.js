
const nodemailer = require('nodemailer');

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Utilisation de l'email défini dans le fichier .env
    pass: process.env.EMAIL_PASS  // Utilisation du mot de passe d'application généré
  }
});

// Fonction pour envoyer un email de bienvenue avec le mot de passe
const sendWelcomeEmail = async (email, nom, prenom, password) => {
  try {
    const mailOptions = {
      from: `"UBICI RH" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Bienvenue chez UBCI HR MANAGER - Vos informations de connexion',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <div style="text-align: center; padding: 10px; background-color: #f8f8f8; margin-bottom: 20px;">
            <h2 style="color: #333;">Bienvenue chez UBICI</h2>
          </div>
          
          <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>
          
          <p>Nous sommes ravis de vous accueillir dans notre équipe! Votre compte a été créé avec succès dans notre système de gestion.</p>
          
          <p>Voici vos informations de connexion :</p>
          
          <div style="background-color: #f8f8f8; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0;">
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Mot de passe temporaire :</strong> ${password}</p>
          </div>
          
          <p>Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe lors de votre première connexion.</p>
          
          <p>Si vous avez des questions, n'hésitez pas à contacter votre responsable ou le service des ressources humaines.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e1e1;">
            <p style="margin: 0; color: #777; font-size: 14px;">Cordialement,</p>
            <p style="margin: 5px 0 0; color: #777; font-size: 14px;">L'équipe  UBCI </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail
};