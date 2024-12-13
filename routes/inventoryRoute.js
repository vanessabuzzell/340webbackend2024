//Needed Resourses
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


// Route to build inventory view by car details
router.get("/detail/:invId", invController.buildByCarDetail);


// Route to build errors view
router.get("/error/", utilities.handleErrors(invController.errorRoute));


//managment Inv route
router.get("", utilities.handleErrors(invController.buildCarManagement));


// Route to build add New car Inventory view
router.get("/addNewInventory", utilities.handleErrors(invController.buildAddVehicle));


// Route to build Add New vehicle Classification view
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification));


 //Route to send add New Classification to data
 router.post(
    '/addClassification', 
    regValidate.addClassRules(),
    regValidate.checkClassData,
    utilities.handleErrors(invController.registerNewClass)
);

// Process the add New Inventory attempt
router.post(
    "/addNewInventory",
    //regValidate.addNewInvRules(),
    //regValidate.checkInvData,
    utilities.handleErrors(invController.registerNewInventory)
  )
  console.log("inventory 1")
//get inventory json route
  router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build update car Inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.updateInventoryView));

router.post(
  "/edit/:inv_id",
  //regValidate.updateInvRules(),
  //regValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
   )

   //delete route
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteInventoryView));

router.post(
  "/delete/:inv_id",
  //regValidate.addNewInvRules(),
  //regValidate.checkUpdateData,
  utilities.handleErrors(invController.deleteInventory)
   )
module.exports = router;

