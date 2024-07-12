const express = require ('express');
const admin_route = express();
const path= require('path')

const session = require('express-session');
const config = require("../config/config"); 
admin_route.use(session({secret:config.sessionSecret,resave: false,
    saveUninitialized: true}));

const bodyparser = require('body-parser');
admin_route.use(bodyparser.json());
admin_route.use(bodyparser.urlencoded({extended:true}));

admin_route.set('view engine','ejs');
admin_route.set('views', path.join(__dirname, '../views/admin'));

const auth = require('../middlewares/adminAuth')

const adminController = require('../Controllers/adminController');

admin_route.get('/',auth.isLogout,adminController.loadLogin);
 
admin_route.post('/',adminController.verifyLogin);

admin_route.get('/home',auth.isLogin,adminController.loadDashboard);

admin_route.get('/logout',adminController.adminLogout);

admin_route.get('/dashboard',adminController.adminDashboard);

admin_route.get('/newUser',auth.isLogin,adminController.newUserLoad);

admin_route.post('/newUser',adminController.addUser);

admin_route.get('/editUser',auth.isLogin,adminController.editUserLoad);

admin_route.post('/editUser',adminController.updateUsers);

admin_route.get('/deleteUser',adminController.deleteUser);





admin_route.get('*',(req,res)=>{
    res.redirect('/admin')
});

module.exports = admin_route;

