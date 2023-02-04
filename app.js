const express = require("express");
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const User = require("./models/myusers");

const mysql = require("./sql_control");

app = express();

// jwt token 
const jwt = require("jsonwebtoken");

jwt_key = "pratik"

// password encryption
const crypto = require("crypto");
//var key = "password";
var algo = "sha256"




json_parser = body_parser.json();

// using in local host -------

// mongoose.connect("mongodb://localhost/mongodb_sql", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then((e) => {
//     console.log("connected to dbbbbbbbbb");
//     // console.log(e);
// })

//  used in docker ------

mongoose.connect("mongodb://mongo/mongo_database", {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then ((e)=>{
    console.log("connected to dbbbbbbbbb");
    console.log(e);
})

//saying hello

app.get("/", function (req, res) {

    res.send("hell0");
});
const algorithm = 'aes-192-cbc';
const iv = Buffer.alloc(16, 0);
const password = 'bncaskdbvasbvlaslslasfhj';
const key = crypto.scryptSync(password, 'GfG', 24);

app.post('/reg', json_parser, function (req, res) {

    // Node.js program to demonstrate the
    // cipher.final() method

    // Creating and initializing algorithm and password

    const pass_main = req.body.password;
    // Getting key for the cipher object


    // Defining password

    // Defining key



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
    }).catch(() => {

        res.send("you not entered data correctly....!!!!!!!!")
    });

    user.save().then((result) => {
        console.log("save scucceeesfullyuuuuuuuuuu")
        console.log(result);

        // res.send(` successfully registered as ${user} `)


        //  jwt.sign({result}, jwt_key,(err,token)=>{

        //       res.json(token);
        // })
    })


})

app.post('/login', json_parser, (req, res) => {

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

            console.log("wrong password entered...")
        }



    }).catch(() => {

        console.log("username is not correct entered....")
    })
    // User.findOne({username:req.body.username}).then((data)=>{


    //     // const data_part ={

    //     //     data_username:req.bod.username,
    //     //     data_password:req.body.password,

    //     // }
    //  // Creating decipher
    // })
})



app.get('/user_prof', auth_token, (req, res) => {

    jwt.verify(req.token, jwt_key, async (err, auth_data) => {

        if (err) {

        }
        else {
            console.log("in else stat")//  res.json({ result: err })
            console.log(auth_data.data.user_name);
            const user = await User.findOne({ username: auth_data.data.user_name });
            console.log(user);
            res.json(user);



            // res.json({ massage: "profil accessed", auth_data })
            // console.log(auth_data);
        }
    })
})

function auth_token(req, res, next) {
    console.log("in auth functin")
    const bearer_header = req.headers['authorization']

    bearer_split = bearer_header.split(' ');

    console.log(bearer_split);

    req.token = bearer_split[1];
    next();
    //    if (typeof bearer_header !== 'undefined'){

    //     //    res.send("hello")
    //    }
    //    else {

    //     res.send({"result":"token not provided"});

    //    }




}



app.get('/get_all_users_profile', auth_token, (req, res) => {

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
})

// get_profile api..... 

app.get('/get_prof', auth_token, (req, res) => {
    console.log("inter in jwt verify.....")

    jwt.verify(req.token, jwt_key, async (err, auth_data) => {

        if (err) {
            res.json({ result: err })
        }
        else {


            if (auth_data.data.role == 'admin' || auth_data.data.role == 'user') {
                console.log("enter in if err")
                const user = await User.findById({ _id: auth_data.data._id });
                // console.log(user);
                res.json(user);
            }




            else {

                res.send("ur role is not correct enter ...");
            }
        }
    })
})


//update own profile data 
app.post('/update_prof', json_parser, auth_token, function (req, res) {

    console.log("enter in updATE BLOCK")
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




})


app.delete('/delete/:user_id', auth_token, (req, res) => {

    console.log("inter int delete");

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

})


app.post('/update_user_profile/:user_id', json_parser, auth_token, function (req, res) {


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

                updating_user = await User.findById({ _id: req.params.user_id });

                if (updating_user.user_name == user.role) {


                    const update_user = await User.findByIdAndUpdate(
                        {
                            _id: req.params.user_id
                        }, user  // here updating the student 

                    );

                    res.json(update_user);
                }
                else{
                    res.send(" error:u can't update user name.....!!!!!!");
                }
            }




            else {

                res.send("ur not admin...!");
            }
        }
    })




})


const port = process.env.PORT || 4000



//port = 5000;


app.listen(port, (() => {

    console.log(`listening on ${port}`);
}));

