const User = require('../models/userModel');
const bcrypt= require('bcrypt'); 

const loadLogin = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message); 
    }
}

const loadDashboard = async(req,res)=>{
    try {
        const userData=await User.findOne({isAdmin:1});
        res.render('home',{userData})
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;


        const userData=await User.findOne({email:email});

        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);

            if(passwordMatch){
                if(userData.isAdmin === 0){
                    res.render('login',{message:"you are not an admin."})
                }else{
                    req.session.admin_id = userData._id;
                    res.redirect('/admin/home');
                } 
            }else{
            res.render('login',{message:"Invalid Email or Password"});
            }
        }else{
            res.render('login',{message:"you are not an admin"});
        }

    }catch (error){
        console.log(error.message)
    }
}


const adminLogout = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/admin/')
    } catch (error) {
        console.log(error.message);
    }
}

const adminDashboard = async(req,res)=>{
    try {
        var search = '';
        if (req.query.search) {
            search = req.query.search;
        }
        const usersData=await User.find({isAdmin:0,
             $or:[
                {name:{$regex: '.*' + search + '.*', $options: 'i'}},
                {email:{$regex: '.*' + search + '.*', $options: 'i'}},
                {phone:{$regex: '.*' + search + '.*', $options: 'i'}}
                ]});
        res.render('dashboard',{users:usersData});
    } catch (error) {
        console.log(error.message);
    }
}

const newUserLoad = async(req,res)=>{
    try {
        res.render('newUser');
    } catch (error) {
        console.log(error.message);
    }
}

const securePassword = async(password)=>{
    try{
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error){
        console.log(error.message);
    }
}

const addUser = async(req,res)=>{
    try {
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;

        const spassword = await securePassword(req.body.password);


        const user = new User({
            name:name,
            email:email,
            phone:phone,
            password:spassword,
            isAdmin:0
        })

        const userData = await user.save();

        if (userData) {
            res.redirect('/admin/dashboard');
        } else {
            res.render('newUser',{message:"Something went wrong"});
        }

    } catch (error) {
        console.log(error.message);
    }
}

const editUserLoad = async(req,res)=>{
    try {
        const id = req.query.id;
        const userData = await User.findById({ _id: id });
        if (userData) {
            res.render('editUser',{user:userData});
        } else {
            res.redirect('/admin/dashboard')
        }

    } catch (error) {
        console.log(error.message);
    }
}

const updateUsers = async(req,res)=>{
    console.log(req.body);
    try {
        console.log('reached');
        var id = req.body.id;
        console.log(id);
        const updateData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            isVerified: req.body.verify
        };

        await User.findByIdAndUpdate(id, updateData, { new: true });
        
        const userData = await User.findById(id,);

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
}    



const deleteUser = async(req,res)=>{
    try {
        const id = req.query.id;
        const userData = await User.deleteOne({ _id: id });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
} 


module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    adminLogout, 
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser
}

    
