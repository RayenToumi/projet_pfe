const mongoose    = require('mongoose');
const TicketModel = require('../models/TicketSchema');
const UserModel   = require('../models/UserSchema');

async function migrate() {
  await mongoose.connect('mongodb://localhost:27017/ta_base'); // adapte l’URL

  const tickets = await TicketModel.find({
    technicien: { $exists: true, $ne: null }
  });

  let count = 0;
  for (const t of tickets) {
    const [nom, prenom] = t.technicien.split(' ');
    const user = await UserModel.findOne({ nom, prenom });
    if (user) {
      t.technicienId = user._id;
      // optionnel : t.technicien = null;
      await t.save();
      count++;
    }
  }

  console.log(`Migration terminée, ${count} tickets mis à jour.`);
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
