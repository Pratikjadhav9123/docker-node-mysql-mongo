const mongoose = require("mongoose");

const User = require("../models/myusers");
const mysql = require("../sql_control");


 // jwt token ---

const jwt = require("jsonwebtoken");
const jwt_key = "pratik"

// crypto setup -----

const crypto = require("crypto");
const algorithm = 'aes-192-cbc';
const iv = Buffer.alloc(16, 0);
const password = 'bncaskdbvasbvlaslslasfhj';
const key = crypto.scryptSync(password, 'GfG', 24);



const user_reg = function (req, res) {

    
    const pass_main = req.body.password;
   
    // Creating cipher
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
    cipher.write(pass_main);
    cipher.end();




    const user = new User({

        role: req.body.role,
        username: req.body.username,
        name: req.body.name,
        // password: encrypted,
        gender: req.body.gender,
        skill: req.body.skill

    })


    mysql.save(req.body.username, encrypted).then(() => {

        res.send("save succussfully pass and user name....")
    }).catch((e) => {
        console.log(e);
        res.send("you not entered data correctly....!!!!!!!!")
    });

    user.save().then((result) => {
        console.log("save scucceeesfullyuuuuuuuuuu")
        console.log(result);


     })


}

module.exports = {user_reg}    


