const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

router.get("/signup", (req, res) => {
  res.render("signup");
});

//  Handles signup submission & Map the fields from the Pug form name attributes
router.post("/signup", async (req, res) => {
  try {
    const newUser = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      PhoneNumber: req.body.PhoneNumber,
    });

    // Use passport-local-mongoose's .register() method to handle hashing the password
    await User.register(newUser, req.body.password);

    res.redirect("/login");
  } catch (error) {
    console.error("Signup Error: ", error);
    // If user already exists or validation fails, reload signup
    res.render("signup", { errorMessage: error.message });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

// on submission of login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message: info.message || "Invalid credentials",
        });
    }

    //on login failure
    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Login session failed" });
      }
      // after success be redirected to dashboard
      return res.json({ success: true, redirectUrl: "/dashboard" });
    });
  })(req, res, next);
});

module.exports = router;
