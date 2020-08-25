const express = require('express');
const router = express.Router();

const { signup, signin, signout,requireSignin } = require("../controllers/auth"); 
const { userSignupValidator } = require('../validator/index');

router.post('/signup',userSignupValidator,signup);    //signup is callback fun
router.post('/signin',signin);
router.get('/signout',signout);

module.exports = router;