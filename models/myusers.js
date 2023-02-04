const mongoose = require('mongoose');

const User_schema=new mongoose.Schema({
    
    role: String,
    name :String,
    username:String,
    password:String,
    gender: String,
    skill: String

})


module.exports=mongoose.model('User',User_schema);

// mongoose.model('pratik',User_schema);
