//Needed Resourses
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/inventory-validation")
console.log("inventory 1")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
console.log("inventory 2")

// Route to build inventory view by car details
router.get("/detail/:invId", invController.buildByCarDetail);

console.log("inventory 3")
// Route to build errors view
router.get("/error/", utilities.handleErrors(invController.errorRoute));
console.log("inventory 4")

//managment Inv route
router.get("", utilities.handleErrors(invController.buildCarManagement));
console.log("inventory 5")

// Route to build add New car Inventory view
router.get("/addNewInventory", utilities.handleErrors(invController.buildAddVehicle));
console.log("inventory 6")

// Route to build Add New vehicle Classification view
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification));
console.log("inventory 7")

 //Route to send add New Classification to data
 router.post(
    '/addClassification', 
    //regValidate.addClassRules(),
    //regValidate.checkClassData,
    utilities.handleErrors(invController.registerNewClass)
);
console.log("inventory 8")
// Process the add New Inventory attempt
router.post(
    "/addNewInventory",
    //regValidate.addNewInvRules(),
    //regValidate.checkInvData,
    utilities.handleErrors(invController.registerNewInventory)
  )
//get inventory json route
  router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

module.exports = router;

