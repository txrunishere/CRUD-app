require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const {connectToMongoDB} = require('./connect');

const app = express();
const PORT = process.env.PORT || 8080;

//Mongoose Connection
connectToMongoDB(process.env.MONGO_URL).then(() => console.log("Connection Success")).catch((err) => console.log("Error is", err));

// Middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({
    secret: "tarun@1123$098",
    saveUninitialized: true,
    resave: false
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static('./uploads'))

// Templating engine
app.set("view engine", "ejs");


// Route Prefix
app.use('', require('./routes/routes')); 

app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));