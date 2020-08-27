const express = require('express');
const router = express.Router();

const { create,productById, read ,remove , update ,list ,listBySearch, photo} = require('../controllers/products');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');

const { userById } = require('../controllers/user');

router.get('/product/:productId',read);
router.post('/product/create/:userId',requireSignin, isAdmin, isAuth,create);
router.delete('/product/:productId/:userId',
               requireSignin,
                isAdmin, isAuth,
                remove);
router.put('/product/:productId/:userId',
               requireSignin,
                isAdmin, isAuth,
                update);                

router.get('/products',list);                

router.param("userId",userById);
router.param("productId",productById);
router.post("/products/by/search", listBySearch);
router.get("/product/photo/:productId",photo);

module.exports = router;