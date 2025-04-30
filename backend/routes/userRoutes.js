const express = require("express");
const { SignUp, login, getUserDetails } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/signup", SignUp);
router.post("/login",login );
router.get("/me", authMiddleware, getUserDetails);

module.exports = router;
 