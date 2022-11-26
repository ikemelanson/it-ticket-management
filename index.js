
const express = require('express'); //brings in express library
const res = require('express/lib/response');//assigns express library to variable

const app = express(); //creates express application objrct to access express methods by calling express constuctor

const path = require("path");

const port = 3000;//assigns port value

app.use(express.urlencoded({extended:true}));//takes response object and turns it into a json object

const knex = require("knex")(
    {
        client : "pg",
        connection : {
            host : "localhost", 
            user : "postgres",
            password : "admin",
            database : "it_tickets",
            port : 5432
        }
    }
);

app.use(express.static("public"));//makes public folder availbale over server

// app.get("/", (req,res) => {
//     res.render("index",{});
// });

app.get("/", (req, res) => {
    res.send("asdf")
});

app.listen(port, () => console.log("Server started"))//gives port where app will listen