const express = require("express");
const user = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const SignUp = async (req, res) => {
  try {
    const { name, email, password, country } = req.body;

    const existedUser = await user.findOne({ email });
    if (existedUser) {
      return res.status(400).json({ message: "Email Already Exists" });
    }

    const createdUser = await user.create({
      name,
      email,
      password,
      country,
    });

    const token = jwt.sign(
      { id: createdUser._id, email: email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );
    
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
