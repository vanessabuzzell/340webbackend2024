/* ****************************************
*Routes
* *************************************** */
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  build login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
  /* ****************************************
*  build registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      
    })
  }

  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

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



/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
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
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

   /* ****************************************
*  build account management view
* *************************************** */
async function buildManagment(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/managment", {
    title: "Logged In",
    nav,
    errors: null,
    
  })
}
/* ****************************************
*  build account view
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account", {
    title: "Welcome Basic",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
async function getAccountJSON(req, res, next) {
  const account_email = parseInt(req.params.account_email)
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (accountData[0].account_id) {
    return res.json(accountData)
  } else {
    next(new Error("No data returned"))
  }
}
/* ***************************
 *  Build update account view
 * ************************** */
async function updateAccountView(req, res, next) {
  const account_email = req.params.account_email
  let nav = await utilities.getNav()
  const itemDataArray = await accountModel.getAccountByEmail(account_email)
  const itemData = itemDataArray[0];
  const itemName = `${itemData.account_firstname} ${itemData.account_lastname}`

  console.log("Rendering edit-inventory view with data:", itemData);
  res.render("./account/editAccount", {
    title: "Update " + itemName,
    nav,
    errors: null,
    account_id: itemData.account_id,
    account_firstname: itemData.account_firstname,
    account_email: itemData.account_email,
    account_type: itemData.account_type,
    account_password: itemData.account_password,
    
   
  })
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccount (req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    account_type,
    account_password
    
  } = req.body
  const updateResult = await invModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    account_type,
    account_password
    
  )

  if (updateResult) {
    const itemName = updateResult.account_firstname + " " + updateResult.account_lastname
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("account/account")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("account/editAccount", {
    title: "Update " + itemName,
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    account_type,
    account_password
    })
  }
}
  
  module.exports = { 
    buildLogin, 
    buildRegister, 
    registerAccount, 
    accountLogin,
    buildManagment,
    buildAccount,
    getAccountJSON,
    updateAccountView,
    updateAccount, 
    }
  
