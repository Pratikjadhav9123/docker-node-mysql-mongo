const mongoose = require("mongoose");
const User = require("../models/myusers");

const mysql = require("../sql_control");


// jwt token 
const jwt = require("jsonwebtoken");
const jwt_key = "pratik"



const admin_update = function (req, res) {


    console.log("inter int admin update");

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

                const user = {

                    role: req.body.role,
                    username: req.body.username,
                    name: req.body.name,

                    gender: req.body.gender,
                    skill: req.body.skill


                };

                var user_id_flag = 0;

                updating_user = await User.findById({ _id: req.params.user_id }).then(() => {

                    user_id_flag = 1;
                    // console.log(r)

                }).catch(() => {

                    user_id_flag = 0;
                });


                console.log(updating_user);

                console.log("hiiiiii")

                if (user_id_flag) {

                    updating_user = await User.findById({ _id: req.params.user_id })

                    if (updating_user.username == user.username ) {         // in schema i have write username insted of user_name

                        if(user.role == "admin" || user.role == "user"){

                        const update_user = await User.findByIdAndUpdate(
                            {
                                _id: req.params.user_id
                            }, user  // here updating the student 

                        );

                        res.json(update_user);
                        }
                        else{
                         res.send("wrong entered role ..!!!!!!");

                        }
                    }
                    else {
                        res.send(" error:u can't update user name.....!!!!!!");
                    }
                }
                else{
                    res.send("wrong user_id entered.....!!!!!!!!");
                    console.log("wrong entered user_id..!!!!!!");
                }
            }




            else {

                res.send("ur not admin...!");
            }
        }
    })




}


module.exports = { admin_update };
