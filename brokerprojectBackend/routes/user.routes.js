const express= require('express');
const {home,deleteUser} = require('../controllers/user.controller.js');
const { verify } = require('jsonwebtoken');
const verifyToken = require('../utils/verifyUser.js');

const router=express.Router();


router.get('/',home);
router.delete('/delete/:id',verifyToken,deleteUser);

module.exports = router;