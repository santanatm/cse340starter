/* Account Controller */
const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors:null,
    })
  }

  async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors:null
    })
  }

  async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
   
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )
   
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors:null
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors:null
      })
    }
  }

  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  else{
    req.flash("notice", "You are logged in.")
    res.status(200).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
     })
  }
  
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    return res.redirect("/account/")
    }
   } catch (error) {
    return new Error('Access Forbidden')
   }
  }
  
 /****************************************** */
 //async function buildManagment(req, res, next) {

 //}

 
  module.exports = { buildLogin, buildRegister, registerAccount, accountLogin }