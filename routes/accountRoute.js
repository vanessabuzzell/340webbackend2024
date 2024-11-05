const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accController = require("../controllers/accController")

// Route to build inventory by classification view
router.get("", accController.accountView);

// Route to build inventory view by car details
router.get("/detail/invId", invController.buildByCarDetail);

module.exports = router;