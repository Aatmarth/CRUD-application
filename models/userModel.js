const mongoose = require("mongoose");

const userSchmea = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Number,
        required:true
    },
    isVerified:{
        type: Number,
        default:0
    }
});

module.exports= mongoose.model('User',userSchmea);