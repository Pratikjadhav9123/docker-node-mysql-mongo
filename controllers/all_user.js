const mongoose = require("mongoose");

const User = require("../models/myusers");
const mysql = require("../sql_control");


 // jwt token 
const jwt = require("jsonwebtoken");
const jwt_key = "pratik"


const all_user= (req, res) => {

    const bearer_header = req.headers['authorization']

    bearer_split = bearer_header.split(' ');

    console.log(bearer_split);

    req.token = bearer_split[1];


    jwt.verify(req.token, jwt_key, async (err, auth_data) => {

        if (err) {
            console.log("you dont have valid token ......!")
            res.json({ result: err })
        }
        else {

            const user = await User.findOne({ username: auth_data.data.user_name });


            if (user.role == 'admin') {
                User.find().then((result) => {

                    res.json(result);
                })
            }




            else {

                res.send("u r not admin");
            }
        }
    })
}



module.exports = {all_user}