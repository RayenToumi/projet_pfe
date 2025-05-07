const mongoose = require('mongoose');

const commentaireSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: [true, "L'ID du ticket est obligatoire"]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "L'utilisateur est obligatoire"]
  },
  nom: {
    type: String,
    // Suppression de la contrainte de validation
    // required: [true, "Le nom est obligatoire"]
  },
  prenom: {
    type: String,
    // Suppression de la contrainte de validation
    // required: [true, "Le prénom est obligatoire"]
  },
  commentaire: {
    type: String,
    required: [true, "Le commentaire ne peut pas être vide"],
    maxlength: [500, "Le commentaire ne doit pas dépasser 500 caractères"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

commentaireSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Commentaire', commentaireSchema);
