const mongoose = require("mongoose");

// importing databases files ----

const User = require("../models/myusers");
const mysql = require("../sql_control");

// jwt token ------

const jwt = require("jsonwebtoken");
const jwt_key = "pratik"


//  crypto setup -------

const crypto = require("crypto");
const algorithm = 'aes-192-cbc';
const iv = Buffer.alloc(16, 0);
const password = 'bncaskdbvasbvlaslslasfhj';
const key = crypto.scryptSync(password, 'GfG', 24);







const user_update = function (req, res) {

    console.log("enter in updATE BLOCK")
    const bearer_header = req.headers['authorization']

    bearer_split = bearer_header.split(' ');

    console.log(bearer_split);

    req.token = bearer_split[1];


    jwt.verify(req.token, jwt_key, async (err, auth_data) => {

        if (err) {

            res.json({ result: err })
        }
        else {

            const mysql_user = await User.findOne({ username: auth_data.data.user_name });


            if (mysql_user.role == 'admin' || mysql_user.role == 'user') {

                const update_pass = req.body.password;

                const cipher = crypto.createCipheriv(algorithm, key, iv);

                // Declaring encrypted
                let encrypted = '';

                // Reading data
                cipher.on('readable', () => {
                    let chunk;
                    while (null !== (chunk = cipher.read())) {
                        encrypted += chunk.toString('base64');
                    }
                });

                // Handling end event
                cipher.on('end', () => {
                    console.log(encrypted);
                });

                // Writing data
                cipher.write(update_pass);
                cipher.end();




                const user = {

                    role: req.body.role,
                    username: req.body.username,
                    name: req.body.name,
                    // password: encrypted,
                    gender: req.body.gender,
                    skill: req.body.skill


                };


                if (user.role == 'user' && user.username == auth_data.data.user_name) {     //  u can't change username

                    mysql.update_password(encrypted, auth_data.data.user_name);  // updating password in mysql

                    const user = await User.findOne({ username: auth_data.data.user_name });


                    const update_user = await User.findByIdAndUpdate(
                        {
                            _id: mysql_user._id
                        }, user                                               // here updating the student  data in mongodb

                    );

                    res.json(update_user);
                }

                else {

                    console.log(mysql_user.role)
                    console.log(user.role)
                    if (mysql_user.role == user.role) {

                        mysql.update_password(encrypted, auth_data.data.user_name);  // updating password in mysql

                        let mysql_user = await User.findOne({ username: auth_data.data.user_name });
                        const update_user = await User.findByIdAndUpdate(
                            {
                                _id: mysql_user._id
                            }, user  // here updating the student 

                        );

                        res.json(update_user);
                    }

                    else {

                        res.send(" invalid update attempts .... u r doing someting wrong ")
                    }
                }


            }
            else {

                res.send("ur role is not correct enter ...");
            }
        }
    })




}



module.exports = { user_update }
