const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const fs = require('fs');


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


/**
 * GET /
 * Edit a User
 */
router.get('/edit/:id', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.id
        });

        res.render('edit-user', {
            user,
            title: "Edit Page"
        });
    } catch (error) {
        console.log(error);
    }
});


/**
 * POST /
 * Edit a User
 */
router.post('/update/:id', uploads, async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, old_image } = req.body;
    let new_image = old_image;

    try {
        // Handle file uploads
        if (req.file) {
            new_image = req.file.filename;
            if (old_image) {
                fs.unlinkSync(`./uploads/${old_image}`);
            }
        }

        // Update user in the database
        await User.findByIdAndUpdate(id, {
            name,
            email,
            phone,
            image: new_image,
        });

        // Set session message for success
        req.session.message = {
            type: 'success',
            message: 'User updated successfully',
        };

        res.redirect('/');
    } catch (error) {
        console.error('Error updating user:', error);
        req.session.message = {
            type: 'danger',
            message: 'Error updating user',
        };
        res.redirect('/');
    }
});


/**
 * DELETE /
 * Delete a User
 */
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find and delete the user
        const user = await User.findByIdAndDelete(id);

        // If the user exists and has an image, delete the image from the filesystem
        if (user && user.image) {
            const imagePath = path.join(__dirname, 'uploads', user.image);
            try {
                fs.unlinkSync(imagePath); // Delete the image file
            } catch (error) {
                console.error('Error deleting the image:', error);
            }
        }

        // Set the session message and redirect if successful
        req.session.message = {
            type: 'info',
            message: 'User deleted successfully'
        };
        res.redirect('/');
    } catch (err) {
        // Handle any errors during the deletion process
        res.redirect('/');
    }
});


module.exports = router;