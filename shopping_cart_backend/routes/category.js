const express = require('express');
const router = express.Router();

const { create,categoryById ,read ,update,remove,list} = require('../controllers/category');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');;

const { userById} = require('../controllers/user'); 

router.get('/category/:categoryId',read);
router.get('/categories',list);
//only admin access
router.post('/category/create/:userId',requireSignin,isAuth,isAdmin,create);
router.put('/category/:categoryId/:userId',requireSignin,isAuth,isAdmin,update);
router.delete('/category/:categoryId/:userId',requireSignin,isAuth,isAdmin,remove);


router.param ("categoryId",categoryById);
router.param("userId",userById);

module.exports = router