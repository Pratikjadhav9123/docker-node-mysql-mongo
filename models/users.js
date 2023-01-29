const mongoose = require('mongoose');

const User_schema=new mongoose.Schema({
    
    role: String,
    username:String,
    name :String,
    // email: String,
    // address:String,
    password:String
})


module.exports=mongoose.model('User',User_schema);