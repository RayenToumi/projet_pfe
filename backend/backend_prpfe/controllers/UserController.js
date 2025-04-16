const userModal = require('../models/UserSchema');

module.exports.getAllUsers = async (req, res) => {
  try {
    const userlist = await userModal.find();
    if (!userlist  ) {
      throw new Error("Users not found");
    }
    res.status(200).json(userlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports.addUser = async (req, res) => {
    try {
        const { nom, prenom, email, password, role, age, user_image } = req.body;

        const newUser = new userModal({
            nom,
            prenom,
            email,
            password,
            role,
            age,
            user_image
        });

        const useradded = await newUser.save();
        res.status(200).json(useradded);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports.deleteUser = async (req, res) => {
    try {
        const{ id   }=req.params;
       const deleted= await userModal.findByIdAndDelete(id)

      res.status(200).json(deleted);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };