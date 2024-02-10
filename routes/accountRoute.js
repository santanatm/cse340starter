// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')


// Route to build login
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to build register
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Route to build Managment
router.get("/", utilities.handleErrors(accountController.buildManagment))
// Route to Edot Account
router.get("/editAccount", utilities.handleErrors(accountController.editAccount));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  );

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the login request
router.post(
  "/",
  utilities.handleErrors(accountController.buildManagment)
)

module.exports = router;