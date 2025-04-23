const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/allusers', UserController.getAllUsers);
router.post('/adduser',UserController.addUser);
router.delete('/deleteuser/:id',UserController.deleteUser);
router.put('/updateuser/:id',UserController.updateUser);
module.exports = router;