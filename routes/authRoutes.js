const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User'); // Path to your User model

// ==========================================
// SIGNUP ROUTES
// ==========================================

// GET: Render the signup form
router.get('/signup', (req, res) => {
    res.render('signup'); // Renders signup.pug
});

// POST: Handle signup submission
router.post('/signup', async (req, res) => {
    try {
        // Map the fields from the Pug form name attributes
        const newUser = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            PhoneNumber: req.body.PhoneNumber // Maps to name="PhoneNumber"
        });

        // Use passport-local-mongoose's .register() method to handle hashing the password
        await User.register(newUser, req.body.password);
        
        // Redirect to login page after a successful signup
        res.redirect('/login');
    } catch (error) {
        console.error("Signup Error: ", error);
        // If user already exists or validation fails, reload signup
        res.render('signup', { errorMessage: error.message });
    }
});

// ==========================================
// LOGIN ROUTES
// ==========================================
router.get('/login', (req, res) => {
    res.render('login'); // Renders login.pug
});

// POST: Handle login submission via AJAX/Fetch
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { 
            return res.status(500).json({ success: false, message: "Server error" }); 
        }
        if (!user) { 
            // Custom message from Passport strategy (e.g., "Password incorrect")
            return res.status(401).json({ success: false, message: info.message || "Invalid credentials" }); 
        }
        
        // Establish the session
        req.logIn(user, (err) => {
            if (err) { 
                return res.status(500).json({ success: false, message: "Login session failed" }); 
            }
            // SUCCESS! Tell the frontend it's safe to show the animation and redirect
            return res.json({ success: true, redirectUrl: '/dashboard' });
        });
    })(req, res, next);
});

// ==========================================
// LOGOUT ROUTE
// ==========================================
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

module.exports = router;