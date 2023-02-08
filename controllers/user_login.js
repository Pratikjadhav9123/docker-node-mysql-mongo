const mongoose = require("mongoose");

const User = require("../models/myusers");
const mysql = require("../sql_control");


 // jwt token setup -----

const jwt = require("jsonwebtoken");
const jwt_key = "pratik"

// crypto setup-----

const crypto = require("crypto");
const algorithm = 'aes-192-cbc';
const iv = Buffer.alloc(16, 0);
const password = 'bncaskdbvasbvlaslslasfhj';
const key = crypto.scryptSync(password, 'GfG', 24);


const user_login = (req, res) => {

    console.log("enter in login ")


    // checking username in  mysql database ------

    mysql.get_perticular_User(req.body.username).then((result) => {

        // making data model for jwt token to used -----
        

        var data = {

            user_name: result[0].user_name,
            password: result[0].password
        }




        // creating decryption model --------

        const decipher =
            crypto.createDecipheriv(algorithm, key, iv);


        // Declaring decrypted
        let decrypted = '';

        // Reading data
        decipher.on('readable', () => {
            let chunk;
            while (null !== (chunk = decipher.read())) {
                decrypted += chunk.toString('utf8');
            }
        });

        // Handling end event
        decipher.on('end', () => {
            console.log(decrypted);
        });

        // Encrypted data which is to be decrypted
        const encrypted = data.password;

        decipher.write(encrypted, 'base64');      // inserting pssword for decryption 
        decipher.end();



        if (decrypted == req.body.password) {
            console.log("enter in if statement")

            // generating  jwt token --------

            jwt.sign({ data }, jwt_key, (err, token) => {
                console.log(data)
                mysql.insert_token(token, data.user_name);   // inserting token in mysql server
                res.json(token);
            })

        }
        else {

            res.send("wrong password entered..!!!!!")
            console.log("wrong password entered...")
        }



    }).catch(() => {

        res.send("username is not correct entered....!!!!!!")
        console.log("username is not correct entered....")
    })

}




module.exports = {
    
    user_login,
    
} 