// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Route to build login
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build register
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to build register
router.post("/register", utilities.handleErrors(accountController.registerAccount));

module.exports = router;