const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('/users', (req, res) => {
    res.send("All Users");
});

module.exports = router