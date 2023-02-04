const express = require("express");
//const mongoose = require("mongoose");
//const body_parser = require("body-parser");

const mysql = require("mysql2");


const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "Pratik@123",
    database: "node_app"

})
connection.connect((err, result) => {
    if (err) {
        console.log(err);
    }
    else console.log("connected to sql ")
})


async function get_tables() {

    connection.query("select * from password_token", function (err, table) {

        if (err) {

            console.log("error:", err);
        }
        else {
            console.log("table:", table);
        }
    });
    // console.log(result);
}




async function save(user_name, password) {

    const result = connection.promise().query(`insert into password_token(user_name,password) value(?,?)`, [user_name, password]

        // (err, data) => {

        //     if (err) {

        //         console.log(err);
        //     }
        //     else {

        //         console.log("save succussfully pass and user name in sql....");
        //         //res.send("reg succees fully")
        //     }
        // }



    )
    return result;
}








async function insert_token(Token,user_name){

    connection.query(`update password_token set token=? where user_name=?`,[Token,user_name],
    
    
    
    (err,data)=>{

        if(err){

            console.log(err);
        }
        else{

            console.log("saved token.....");
        }
    }
    )
}


async function get_perticular_User(user_name) {


    const result = await connection.promise().query(`select * from password_token where user_name = ?`, [user_name]

    )

    return result[0];




}

async function update_password(update_password,user_name){

    connection.query(`update password_token set password=? where user_name=?`,[update_password,user_name],
    
    
    
    (err,data)=>{

        if(err){

            console.log(err);
        }
        else{

            console.log("updated password.....");
        }
    }
    )
}


// get_tables();
// get_perticular_User("happy")

// insert_data("happy","EB2MVb8d0TjvjNj+iq5lfg==","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjYzZGI5ZjNhM2U5ZmYwOWYyMjg5OTdmMCIsInJvbGUiOiJhZG1pbiIsIm5hbWUiOiJqZGtsamQiLCJ1c2VybmFtZSI6Impna2xkbGZrbHNqZiIsInBhc3N3b3JkIjoiRUIyTVZiOGQwVGp2ak5qK2lxNWxmZz09IiwiX192IjowfSwiaWF0IjoxNjc1NDA0NDA4fQ.SO-y7ugpsX3ea7DKDczCsE0BAEXxjCzI2T7zBMuyKoQ");

module.exports = {

    get_tables,
    save,
    get_perticular_User,
    insert_token,
    update_password



}