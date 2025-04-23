const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schéma de l'utilisateur
const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 15
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tel: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        
    }
}, { timestamps: true });

// Pré-save pour le hashage du mot de passe avant de l'enregistrer
userSchema.pre("save", async function(next) {
    try {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
