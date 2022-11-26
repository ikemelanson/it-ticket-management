
const express = require('express'); //brings in express library
const res = require('express/lib/response');//assigns express library to variable
const cors = require('cors');
const app = express(); //creates express application objrct to access express methods by calling express constuctor
const viewsDir = __dirname + '/views';

const path = require("path");

const port = 3000;//assigns port value
app.use(cors())
app.use(express.urlencoded({extended:true}));//takes response object and turns it into a json object

const knex = require("knex")(
    {
        client : "pg",
        connection : {
            host : "localhost", 
            user : "postgres",
            password : "admin",
            database : "it_tickets",
            port : 5433
        }
    }
);

app.use(express.static("public"));//makes public folder availbale over server

app.get("/", (req, res) => {
    res.sendFile(viewsDir + '/index.html');
});

app.get("/api", (req, res) => {
    knex.select('*').from("end_user").then(data => {
        res.send(data)
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

app.listen(port, () => console.log("Server started"))//gives port where app will listen