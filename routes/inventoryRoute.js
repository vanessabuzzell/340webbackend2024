//Needed Resourses
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory view by car details
router.get("/detail/invId", invController.buildByCarDetail);

module.exports = router;