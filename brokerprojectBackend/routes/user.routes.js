const express= require('express');
const {home,deleteUser,getUserListing} = require('../controllers/user.controller.js');
const { verify } = require('jsonwebtoken');
const verifyToken = require('../utils/verifyUser.js');

const router=express.Router();


router.get('/',home);
router.delete('/delete/:id',verifyToken,deleteUser);
router.get('/getlisting/:id',verifyToken,getUserListing);

module.exports = router;