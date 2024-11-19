const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accController = require("../controllers/accController")
const regValidate = require("../utilities/account-validation")



// Route to build errors view
//router.get("/error/", utilities.handleErrors(accController.errorRoute));

// Route to build login view
router.get("/login", utilities.handleErrors(accController.buildLogin))

// Route to build register view
router.get("/register", utilities.handleErrors(accController.buildRegister))

// Route to send registration to data
router.post(
    '/register', 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount)
)

module.exports = router;
