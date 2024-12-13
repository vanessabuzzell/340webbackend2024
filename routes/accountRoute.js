const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accController = require("../controllers/accController")
const regValidate = require("../utilities/account-validation")


console.log("account 2")

// Route to build login view
router.get("/login", utilities.handleErrors(accController.buildLogin))
console.log("account 2")

// Route to build register view
router.get("/register", utilities.handleErrors(accController.buildRegister))
console.log("account 2")

// Route to send registration to data
router.post(
    '/register', 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount)
)
console.log("account 2")
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accController.accountLogin)
  )

  router.get("/managment", utilities.handleErrors(accController.buildManagment));

  // Route to build login view
router.get("/account", utilities.handleErrors(accController.buildAccount))

module.exports = router;
