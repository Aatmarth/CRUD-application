const userModel = require('../models/userModel');
const User = require('../models/userModel');
const bcrypt= require('bcrypt');

const loadRegister = async(req,res)=>{
    try{
        res.render("../views/users/registration.ejs");

    } catch(error){
        console.log(error.message);
    }
}


const insertUser = async(req,res)=>{
    console.log(req.body);
    try{
        const spassword = await bcrypt.hash(req.body.password, 10);
        console.log(spassword);
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password:spassword,
            isVerified:0,
            isAdmin:0

        });

        const userData = await user.save();
        if(userData){
            res.render('users/registration',{message:"Registration Successful!"});
        }else{
            res.render('users/registration',{message:"Registration Failed."});

        }

    }catch (error){
        console.log('Error creating user:',error.message);
    }
}

const loginLoad = async(req,res)=>{
    try{
        res.render('users/login')
    }catch (error){
        res.redirect('/home')
        console.log(error.message);
    } 
}

const verifyLogin = async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userData=await User.findOne({email:email});
        console.log(userData);
        if(userData){
            const passwordMatch = await bcrypt.compare(password, userData.password);
            console.log(passwordMatch);
            if(passwordMatch){
                if(userData.isVerified === 0){
                    res.render('users/login',{message:"Please verify your mail."})
                }else{
                    req.session.user_id = userData._id;
                    res.redirect('/home');
                } 
            }else{
            res.render('users/login',{message:"Invalid Username or Password"});
            }
        }else{
            res.render('users/login',{message:"Invalid Username or Password"});
        }

    }catch (error){
        console.log(error.message)
    }
}

const loadHome = async(req,res)=>{
    try{
        const userData = await User.findById({ _id:req.session.user_id })
        res.render('users/home',{user:userData});
    }catch (error){
        console.log(error.message);
    }
}

const userLogout = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
}

const editLoad = async (req, res) => {
    try {
        const id = req.params.id;
        const userData = await User.findById(id);

        if (userData) {
            res.render('users/edit', { user: userData });
        } else {
            res.redirect('/home');
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('/home');
    }
};

const updateProfile = async (req, res) => {
    console.log('reached');
    try {
        const id = req.params.id;
        
        const updateData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            isVerified: req.body.verify 
        };

        await User.findByIdAndUpdate(id, updateData, { new: true });
       res.redirect('/home'); 

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error updating profile."); 
    }
};


module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editLoad,
    updateProfile
}