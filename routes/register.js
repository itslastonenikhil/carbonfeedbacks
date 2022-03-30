const express = require('express');
const router = express.Router();
const utility = require('../utility');
const bcrypt = require('bcrypt');
const { User, Admin } = require('../database');
const { nanoid } = require('nanoid');

router.get('/admin', (req, res) => {
    res.render('register.ejs', { type: 'admin' });
});

router.get('/user', (req, res) => {
    res.render('register.ejs', { type: 'user' });
});

async function createUser(details) {
    const { username, password, email } = details;
    console.log("Details: ", details);

    const date = utility.getDate();

    // hashing password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const new_user = {
        
        username: username,
        password: hashedPassword,
        email: email,
        created_at: date,
    };
    return new_user;
}

router.post('/admin', async (req, res) => {
    const new_admin = await createUser(req.body);
    new_admin.admin_id = nanoid();

    console.log(new_admin);
    console.log("Working");

    try {
        const result = await Admin.createAdmin(new_admin);
        console.log(result);
    } catch (error) {
        throw error;
    }

    res.redirect('/login/admin');
});

router.post('/user', async (req, res) => {
    console.log("Registering new user");
    const new_user = await createUser(req.body);
    console.log(new_user)
    new_user.user_id = nanoid();

    try {
        await User.createUser(new_user);
    } catch (error) {
        throw error;
    }

    res.redirect('/login/user');
});

//TODO: Delete Account
module.exports = router;