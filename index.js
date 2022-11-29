
const express = require('express'); 
const res = require('express/lib/response');
const cors = require('cors');
const app = express(); 
const viewsDir = __dirname + '/views';

const path = require("path");
const bodyParser = require('body-parser');

const port = 3000;
app.use(cors());
app.use(bodyParser.json());

const knex = require("knex")(
    {
        client: "pg",
        connection: {
            host: "localhost",
            user: "postgres",
            password: "admin",
            database: "it_tickets",
            port: 5433
        }
    }
);

// root route access
app.get("/", (req, res) => {
    res.sendFile(viewsDir + '/index.html');
});

// add a new user
app.post("/api/adduser", (req, res) => {
    knex("end_user").insert({
        "user_first_name": req.body.user_first_name,
        "user_last_name": req.body.user_last_name
    }).then(res.send('success'))
});

// add a new technician
app.post("/api/addtech", (req, res) => {
    knex("technician").insert({
        "tech_first_name": req.body.tech_first_name,
        "tech_last_name": req.body.tech_last_name
    }).then(res.send('success'))
});

// make a new team
app.post("/api/maketeam", (req, res) => {
    knex("team").insert({
        "team_name": req.body.team_name
    }).then(res.send('success'))
});

// make a new ticket
app.post("/api/maketicket", (req, res) => {
    // if the ticket if for a team
    if (req.body.tech_id === null) {
        knex("ticket").insert({
            "ticket_name": req.body.ticket_name,
            "ticket_desc": req.body.ticket_desc,
            "end_user_id": parseInt(req.body.end_user_id),
            "tech_id": null,
            "team_id": parseInt(req.body.team_id)
    }).then(res.send('success'))
    }
    // if the ticket is for a technician
    else {
        knex("ticket").insert({
            "ticket_name": req.body.ticket_name,
            "ticket_desc": req.body.ticket_desc,
            "end_user_id": parseInt(req.body.end_user_id),
            "tech_id": parseInt(req.body.tech_id),
            "team_id": null
    }).then(res.send('success'))
    }
});

// get all tickets for teams
app.get("/api/gettickets/teams", (req, res) => {
    knex.select('*')
    .from("ticket")
    .innerJoin("team", "ticket.team_id", "team.team_id")
    .innerJoin("end_user", "ticket.end_user_id", "end_user.end_user_id")
    .whereNotNull("ticket.team_id")
    .orderBy('ticket_id').then(data => {
        res.send(data)
    }).catch(err => {
        console.log(err);
        res.status(500).json({ err });
    });
});

// get all tickets for technicians
app.get("/api/gettickets/techs", (req, res) => {
    knex.select('*')
    .from("ticket")
    .innerJoin("technician", "ticket.tech_id", "technician.tech_id")
    .innerJoin("end_user", "ticket.end_user_id", "end_user.end_user_id")
    .whereNotNull("ticket.tech_id")
    .orderBy('ticket_id').then(data => {
        res.send(data)
    }).catch(err => {
        console.log(err);
        res.status(500).json({ err });
    });
});

// mark a ticket as completed
app.post("/api/markcomplete", (req, res) => {
    knex("ticket").where("ticket_id", parseInt(req.body.ticket_id)).update({
        completed : 1
    }).then(res.send('success')).catch(err => {
        console.log(err);
        res.status(500).json({err});
    })
});

// get all users
app.get("/api/getusers", (req, res) => {
    knex.select("*").from("end_user")
    .then(data => {
        res.send(data)
    }).catch(err => {
        console.log(err);
        res.status(500).json({ err });
    });
});

// get all techs
app.get("/api/gettechs", (req, res) => {
    knex.select("*").from("technician").then(data => {
        res.send(data)
    }).catch(err => {
        console.log(err);
        res.status(500).json({ err });
    });
});

// get all teams
app.get("/api/getteams", (req, res) => {
    knex.select("*").from("team").then(data => {
        res.send(data)
    }).catch(err => {
        console.log(err);
        res.status(500).json({ err });
    });
});

app.listen(port, () => console.log("Server started"))//gives port where app will listen