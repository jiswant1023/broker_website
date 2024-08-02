const express= require('express');
const auth = require('../controllers/auth.controller.js');
const router=express.Router();

router.post("/signup",auth.signup);

router.post("/signin",auth.signin);

router.post("/google",auth.google);

router.get("/signout",auth.signout);

module.exports=router; 