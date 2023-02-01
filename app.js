const express = require("express");
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const User = require("./models/users");
app = express();

// jwt token 
 const jwt = require("jsonwebtoken");

 jwt_key = "pratik"

// password encryption
const crypto =  require("crypto");
//var key = "password";
var algo = "sha256"




json_parser = body_parser.json(); 




mongoose.connect("mongodb://localhost:27017/auth_db", {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then (()=>{
    console.log("connected to db");
})

//saying hello

app.get("/",function(req, res){

    res.send("hell0");
});
const algorithm = 'aes-192-cbc';
const iv = Buffer.alloc(16, 0);
const password = 'bncaskdbvasbvlaslslasfhj';
const key = crypto.scryptSync(password, 'GfG', 24);

app.post('/reg', json_parser,function(req, res){
    
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
    
    role : req.body.role,
    username:req.body.username,
    name :req.body.name,
    password: encrypted,
    gender:req.body.gender,
    skill:req.body.skill

})

user.save().then((result)=>{
    console.log("save scucceeesfully")
    console.log(result);

    res.send(` successfully registered as ${user} `)
//  jwt.sign({result}, jwt_key,(err,token)=>{

//       res.json(token);
// })
})
            
})

app.post('/login',json_parser, (req, res)=>{
    
    console.log("enter in login ")
    
    User.findOne({username:req.body.username}).then((data)=>{
       
        
        // const data_part ={
                  
        //     data_username:req.bod.username,
        //     data_password:req.body.password,

        // }
     // Creating decipher
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
const encrypted =data.password;
 
decipher.write(encrypted, 'base64');
decipher.end();
 

        
    if (decrypted==req.body.password){
        console.log("enter in if statement")
        jwt.sign({data}, jwt_key,(err,token)=>{
            console.log(data)

            res.json(token);
        })
    }    
        
        
        
    })
})



app.get('/user_prof',auth_token,(req,res)=>{

    jwt.verify(req.token, jwt_key, (err, auth_data)=>{

        if(err)
        {
    
            res.json({result:err})
        }
        else{
            res.json({massage:"profil accessed",auth_data})
            console.log(auth_data);
        }
    })
})

function auth_token(req, res, next){
   console.log("in auth functin")
   const  bearer_header = req.headers['authorization']

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



app.get('/get_all_users_profile',auth_token,(req,res)=>{

    jwt.verify(req.token, jwt_key, (err, auth_data)=>{

        if(err)
        {
    
            res.json({result:err})
        }
        else{
            if(auth_data.data.role == 'admin'){
                User.find().then((result)=> {

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

app.get('/get_prof',auth_token, (req,res)=>{
    console.log("inter in jwt verify.....")

    jwt.verify(req.token, jwt_key, async (err, auth_data)=>{
        
        if(err)
        {
            res.json({result:err})
        }
        else{
            
            
            if(auth_data.data.role == 'admin' || auth_data.data.role == 'user'){
                console.log("enter in if err")    
                const user = await  User.findById({_id:auth_data.data._id});
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
app.post('/update_prof', json_parser,auth_token,function(req, res){

     console.log("enter in updATE BLOCK")
    jwt.verify(req.token, jwt_key, async(err, auth_data)=>{
        
        if(err)
        {
            
            res.json({result:err})
        }
        else{
            if(auth_data.data.role == 'admin' || auth_data.data.role == 'user'){
                
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

              
              
              
              
                const user ={

                    role : req.body.role,
                    username:req.body.username,
                    name :req.body.name,
                    password:encrypted,
                    gender:req.body.gender,
                    skill:req.body.skill
                    
        
                };
                

                if (user.role == 'user'){

                    const update_user =  await User.findByIdAndUpdate(
                       {
                       _id :auth_data.data._id
                       },user  // here updating the student 
                        
                       );
   
                   res.json(update_user);    
                }

                else{

                    if(auth_data.data.role == user.role ){

                        const update_user =  await User.findByIdAndUpdate(
                            {
                            _id :auth_data.data._id
                            },user  // here updating the student 
                             
                            );
        
                        res.json(update_user);    
                    }

                    else{

                        res.send(" invalid update ....")
                    }
                }

                
            }




            else {

                res.send("ur role is not correct enter ...");
            }
        }
    })




})


  app.delete('/delete/:user_id',auth_token, (req,res)=>{
    
      console.log("inter int delete");
    
    jwt.verify(req.token, jwt_key, async (err, auth_data)=>{
        

        if(err)
        {
            
            res.json({result:err})
        }
        else{
            if(auth_data.data.role == 'admin' ){
                try{
                    const delete_user =  await User.findByIdAndDelete(req.params.user_id);
                    res.json(delete_user);
                }catch(error){
            
                    res.send("error while deleting data")
                }
            }




            else {

                res.send("ur not admin ....!");
            }
        }
    })

})
    

app.post('/update_user_profile/:user_id', json_parser,auth_token,function(req, res){


    jwt.verify(req.token, jwt_key, async (err, auth_data)=>{
        
        if(err)
        {
            
            res.json({result:err})
        }
        else{
            if(auth_data.data.role == 'admin' ){
                
                const user ={

                    role : req.body.role,
                    username:req.body.username,
                    name :req.body.name,
                
                    gender:req.body.gender,
                    skill:req.body.skill
                    
        
                };
                
                const update_user =  await User.findByIdAndUpdate(
                    {
                    _id :req.params.user_id
                    },user  // here updating the student 
                     
                    );

                res.json(update_user);    
            }




            else {

                res.send("ur not admin...!");
            }
        }
    })




})




port = 5000;
app.listen(port);

