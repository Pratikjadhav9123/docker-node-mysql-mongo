const mongoose = require("mongoose");
const User = require("../models/myusers");

const mysql = require("../sql_control");


// jwt token 
const jwt = require("jsonwebtoken");
const jwt_key = "pratik"


const user_delete = (req, res) => {

    console.log("inter int delete");

    const bearer_header = req.headers['authorization']

    bearer_split = bearer_header.split(' ');

    console.log(bearer_split);

    req.token = bearer_split[1];
    jwt.verify(req.token, jwt_key, async (err, auth_data) => {




        if (err) {

            res.json({ result: err })
        }
        else {

            let mysql_user = await User.findOne({ username: auth_data.data.user_name });

            if (mysql_user.role == 'admin') {
                try {
                    const delete_user = await User.findByIdAndDelete(req.params.user_id);
                    res.json(delete_user);
                } catch (error) {

                    res.send("error while deleting data")
                }
            }




            else {

                res.send("ur not admin ....!");
            }
        }
    })

}


module.exports = { user_delete }