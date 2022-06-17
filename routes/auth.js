const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const saltRounds = 11;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  // Check if user introduced all values
  if (!username || !password) {
    res.render("auth/signup", {
      error: "All fields are mandatory. Please fill them before submitting.",
    });
    return;
  }
  // Check is password meets requirements
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.render("auth/signup", {
      error:
        "Password must have lowercase letters, uppercase letters and at least one number.",
    });
    return;
  }
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(saltRounds);
    // Use salt to hash password
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ username, hashedPassword });
    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
