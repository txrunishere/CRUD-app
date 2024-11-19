const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');


// Image Upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});

var uploads = multer({
    storage: storage,
}).single("image");


// Index Route 
router.get('/', async (req, res) => {
    try {
        // Fetch users using async/await
        const users = await User.find().exec();

        // Render the index page with users
        res.render('index', {
            title: "Home Page",
            users: users
        });
    } catch (err) {
        // Handle errors
        res.json({ message: err.message });
    }
});



/**
 * GET /
 * add users
 */
router.get("/add", (req, res) => {
    res.render("add-user", { title: "Add User" });
});


/**
 * POST /
 * add users
 */
router.post('/add', uploads, async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });
    user.save()
        .then(result => {
            req.session.message = {
                type: 'success',
                message: 'User added successfully'
            };
            res.redirect('/'); 
        })
        .catch(err => {
            req.session.message = {
                type: 'danger',
                message: err.message
            };
            res.redirect('/');
        });
});


module.exports = router;