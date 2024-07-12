const express = require ('express');
const user_route = express();
const session = require('express-session');

const config = require("../config/config"); 
user_route.use(session({secret:config.sessionSecret,resave:false,saveUninitialized:false}));

const auth =  require('../middlewares/auth')

user_route.set('view engine','ejs');
user_route.set('views','./views');

const bodyparser = require('body-parser');
user_route.use(bodyparser.json());
user_route.use(bodyparser.urlencoded({extended:true}));


const path = require('path')

const userController = require("../Controllers/userController");

user_route.get('/register',auth.isLogout,userController.loadRegister);

user_route.post('/register',userController.insertUser);

user_route.get('/',auth.isLogout,userController.loginLoad);
user_route.get('/login',userController.loginLoad);

user_route.post('/login',userController.verifyLogin);

user_route.get('/home',auth.isLogin,userController.loadHome);

user_route.get('/logout',auth.isLogin,userController.userLogout);

user_route.get('/edit/:id',auth.isLogin,userController.editLoad);
user_route.post('/edit/:id',userController.updateProfile);



module.exports = user_route; 
