//Needed Resourses
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory view by car details
router.get("/detail/:invId", invController.buildByCarDetail);

// Route to build errors view
router.get("/error/", utilities.handleErrors(invController.errorRoute));
module.exports = router;