const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('/', (req, res) => {
    res.render("index", { title: "Home Page" });
});

router.get("/add", (req, res) => {
    res.render("add-user", { title: "Add User" });
});

module.exports = router;

