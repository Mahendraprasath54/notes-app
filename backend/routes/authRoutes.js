const express = require("express");
const router = express.Router();
const {createUser, login, getUser} = require('../controllers/userController');
const { authenticateToken } = require("../utilities");


router.post('/create-account',createUser);
router.post('/login',login) 
router.get('/get-user', authenticateToken , getUser) 

module.exports = router;