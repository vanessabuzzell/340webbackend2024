const utilities = require("./index.js")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  const invModel = require("../models/inventory-model") 

    /*  **********************************
    *  addClassification Data Validation Rules
    * ********************************* */
    validate.addClassRules = () => {
      return [
      
         // make is required and must be string
         body("classification_name")
         .trim()
         .escape()
         .isLength({ min: 1 })
         .withMessage("Please provide a vehicle classification name."), // on error this message is sent.
      ]
    }
    
    /* ******************************
     * Check data and return errors or continue to managment page
     * ***************************** */
    validate.checkClassData = async (req, res, next) => {
      const { classification_name } = req.body
      let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/addClassification", {
          errors,
          title: "Add Classification Page",
          nav,
          classification_name,
        })
        return
      }
      next()
    }

  /*  **********************************
  *  inventory Data Validation Rules
  * ********************************* */
  validate.addNewInvRules = () => {
    return [
      // make is required and must be string
      body("inv_make")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a make of vehicle."), // on error this message is sent.
    
      // vehicle model is required and must be string
      body("inv_model")
      .trim()
      .escape()
      .isLength({ min: 2 })
      .withMessage("Please provide the model of the vehicle."), // on error this message is sent.

      // year is required and must be 4 numbers
      body("inv_year")
      .trim()
      .escape()
      .isLength({ min: 4 })
      .withMessage("Year does not meet requirements."),

      // description is required and must be string
      body("inv_description")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a description of vehicle."), // on error this message is sent.

      // image is required and must be string
      body("inv_image")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a image."), // on error this message is sent.

      // thumbnail is required and must be string
      body("inv_thumbnail")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail."), // on error this message is sent.

      // price is required and must be string
      body("inv_price")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a price."), // on error this message is sent.

      //miles is required and must be string
      body("inv_miles")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide amount of miles."), // on error this message is sent.

      // color is required and must be string
      body("inv_color")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a make of vehicle."), // on error this message is sent.

      // classification id is required and must be string
      body("classification_id")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification for the  vehicle."), // on error this message is sent.

    
      // valid vehicle is required and cannot already exist in the database
      body("inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id")
      .trim()
      .withMessage("A valid vehicle is required.")
      .custom(async (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles, 
        inv_color,
        classification_id) => {
        const inventoryExists = await invModel.checkExistingInventory(
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles, 
            inv_color,
            classification_id
        )
        if (inventoryExists){
          throw new Error("vehicle exists. Add a diffrent vehicle")
        }
      }),
  
    ]
  }
  
  /* ******************************
   * Check data and return errors or continue to managment page
   * ***************************** */
  validate.checkInvData = async (req, res, next) => {
    const { 
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles, 
      inv_color,
      classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/managment", {
        errors,
        title: "Managemant Page",
        nav,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles, 
        inv_color,
        classification_id
      })
      return
    }
    next()
  }
  

 
 

  
  module.exports = validate