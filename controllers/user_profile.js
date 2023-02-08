
const mongoose = require("mongoose");

const User = require("../models/myusers");
const mysql = require("../sql_control");


// jwt token 
const jwt = require("jsonwebtoken");
const jwt_key = "pratik"


const user_prof = (req, res) => {


    console.log("enter in user prof")

    const bearer_header = req.headers['authorization']

    bearer_split = bearer_header.split(' ');

    console.log(bearer_split);

    req.token = bearer_split[1];

    jwt.verify(req.token, jwt_key, async (err, auth_data) => {
       
        if (err) {
            
            console.log("token not verified");
            
        }
        else {

            var headers_username=req.headers['username'];
            
    
            mysql.get_perticular_User(headers_username).then(async (result) => {
    
    
                const mysql_token = result[0].token;
    
    
                if (mysql_token == req.token) {
    
                    console.log("in else stat")//  res.json({ result: err })
                    console.log(auth_data.data.user_name);
                    const user = await User.findOne({ username: auth_data.data.user_name });
                    console.log(user);
                    res.json(user);
    
                }

                else{

                    res.send(" un authrized user .....access denied")
                }
    
            }
            )




        }
    })
}





module.exports = { user_prof }


