const accountModel = require("../models/accountModel")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountCont = {}

/**********************
*  Deliver login view
***********************/
accountCont.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
/****************************
*  Deliver registration view
* ***************************/
accountCont.buildSignup = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
}

/* ********************
 *  Account Management
 * ********************/
accountCont.accountManagement = async function (req, res, next) {
    //const account_id = req.params.accountId
    //const data = await accountModel.getAccountById(account_id)
    let nav = await utilities.getNav()
    
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    })
  }

  /*******************
   * Register Account
   *******************/
accountCont.registerAccount = async function(req, res, next){
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
    })
    }
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/**************************
 *  Process login request
 **************************/
accountCont.accountLogin = async function (req, res) {
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

/****************************
 *  Return Accounts As JSON
 ****************************/
   accountCont.getAccountJSON = async (req, res, next) => {
  
  const accountData = await accountModel.getAccounts()
  if (accountData[0].account_id) {
    return res.json(accountData)
  } else {
    next(new Error("No data returned"))
  }
}

accountCont.buildAddAccount = async function (req, res, next) {
  let nav = await utilities.getNav();

  res.render("./account/add-account", {
    title: "Add Account",
    nav,
    errors: null,
  });
};

accountCont.addAccount = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password, account_type } = req.body;

  const accResult = await accountModel.addAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    account_type
  );

  if (accResult) {
    req.flash("notice", "Account Added Successfully.");
    res.redirect("/account/addAccount");
  } else {
    req.flash("notice", "Sorry, adding the Account failed.");
    res.render("./account/add-account", {
      title: "Add Account",
      nav,
      errors: null,
    });
  }
};

accountCont.buildEditAccount = async function (req, res, next) {
  const account_id = parseInt(req.params.accountId);
  let nav = await utilities.getNav();
  const data = await accountModel.getAccountById(account_id);
  const accountData = data[0];

  res.render("./account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email
  });
};

accountCont.updateAccount = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body;

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  );

  if (updateResult) {
    req.flash("notice", "Account Updated Successfully.");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.render("./account/edit-account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    });
  }
};

accountCont.updateAccountPassword = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    account_id,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword
  try {
  // regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
  req.flash("notice", 'Sorry, there was an error processing the registration.')
  res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
  })
  }
  const updateResult = await accountModel.updateAccountPassword(
    account_id,
    hashedPassword,
  );

  if (updateResult) {
    req.flash("notice", "Password Updated Successfully.");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.render("./account/edit-account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
      account_firstname: updateResult.account_firstname,
      account_lastname: updateResult.account_lastname,
      account_email: updateResult.account_email,
    });
  }
};

accountCont.buildDeleteAccount = async function (req, res, next) {
  const account_id = parseInt(req.params.accountId);
  let nav = await utilities.getNav();
  const data = await accountModel.getAccountById(account_id);
  const accountData = data[0];

  res.render("./account/delete-account", {
    title: "Delete Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_type: accountData.account_type,
  });
};

accountCont.deleteAccount = async function (req, res, next) {
  const { account_id } = req.body;
  let nav = await utilities.getNav();
  const data = await accountModel.getAccountById(account_id);
  const accountData = data[0];

  const deleteResult = await accountModel.deleteAccount(account_id);

  if (deleteResult) {
    req.flash("notice", "Account Deleted Successfully.");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.render("./account/delete-account", {
      title: "Delete Account",
      nav,
      errors: null,
      account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_type: accountData.account_type,
    });
  }
};

module.exports = accountCont