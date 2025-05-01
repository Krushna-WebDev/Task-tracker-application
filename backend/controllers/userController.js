const express = require("express");
const user = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const SignUp = async (req, res) => {
  try {
    console.log("SignUp attempt with data:", {
      name: req.body.name,
      email: req.body.email,
      country: req.body.country,
      // not logging password for security
      password_provided: !!req.body.password
    });

    const { name, email, password, country } = req.body;

    // Check if all required fields are present
    if (!name || !email || !password || !country) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const existedUser = await user.findOne({ email });
    if (existedUser) {
      console.log("Email already exists:", email);
      return res.status(400).json({ message: "Email Already Exists" });
    }

    console.log("Creating new user");
    const createdUser = await user.create({
      name,
      email,
      password,
      country,
    });

    console.log("User created with ID:", createdUser._id);

    console.log("Generating JWT token");
    const token = jwt.sign(
      { id: createdUser._id, email: email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );
    
    console.log("Signup successful");
    res.status(201).json({ 
      message: "User created successfully", 
      token,
      user: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        country: createdUser.country
      }
    });
  } catch (error) {
    console.error("Error in SignUp:", error);
    console.error("Error details:", JSON.stringify({
      message: error.message,
      stack: error.stack,
      name: error.name
    }));
    
    res.status(500).json({ 
      message: "Error creating user", 
      error: error.message 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existedUser = await user.findOne({ email });
    if (!existedUser) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const isPasswordValid = await existedUser.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: existedUser._id, email: email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );
    
    res.status(200).json({ 
      message: "Login successful", 
      token,
      user: {
        id: existedUser._id,
        name: existedUser.name,
        email: existedUser.email,
        country: existedUser.country
      } 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error during login", 
      error: error.message 
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const currentUser = await user.findById(userId)
      .select("-password")
      .populate("projects"); 

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: currentUser });
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching user details", 
      error: error.message 
    });
  }
};

module.exports = { SignUp, login, getUserDetails };
