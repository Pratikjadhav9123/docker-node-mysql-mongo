const express = require("express");
const mongoose = require("mongoose");

app = express();

app.use(express.json())

const app_api_routes = require("./routes/app_api_routes");

app.use("/", app_api_routes);


mongoose.connect("mongodb://localhost/mongodb_sql", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((e) => {
    console.log("connected to dbbbbbbbbb");
    // console.log(e);
})

port = 5000;


app.listen(port, (() => {

    console.log(`listening on ${port}`);
}));

//  used in docker ------

// mongoose.connect("mongodb://mongo/mongo_database", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then((e) => {
//     console.log("connected to dbbbbbbbbb");
//     // console.log(e);
// })



// app.get("/", function (req, res) {

//     res.send("hell0");
// });


// for docker ---------

// const port = process.env.PORT || 4000
