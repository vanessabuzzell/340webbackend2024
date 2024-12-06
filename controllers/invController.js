const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    let nav = await utilities.getNav()

    const classification_id = req.params.classificationId 
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + "vehicles", 
        nav,
        grid,
        errors: null,
    })
}
/* ***************************
 *  Build vehical CarDetail view
 * ************************** */
invCont.buildByCarDetail = async function (req, res, next) {
    let nav = await utilities.getNav()

    const inv_id = req.params.invId 
    const data = await invModel.buildByCarDetail(inv_id)
    const carName = data[0].inv_make + " "+ data[0].inv_model
    const grid = await utilities.buildCarDetailGrid(data)
    
    res.render("./inventory/detail", {
        title: carName,
        nav,
        grid,
        data,
        errors: null,
    })

}

/* ***************************
 *  Build car management view
 * ************************** */
invCont.buildCarManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management", {
        title: 'Inventory Managment',
        nav,
        classificationSelect,
        errors: null,
    })

}
/* ****************************************
*  build add New Classification view
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  console.log("addClassificationview")
  let nav = await utilities.getNav()
  
  res.render("inventory/addClassification", {
    title: "Classification Register",
    nav,
    errors: null,
  })
}
 /* ****************************************
  *  Process new Classification
  * *************************************** */
 invCont.registerNewClass = async function (req, res) {
  console.log("proccessClassification")
  let nav = await utilities.getNav()
  const {classification_name } = req.body

  const regResult = await invModel.registerNewClassification(
    classification_name
  )
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${classification_name}, to the class database.`
    )
    let nav = await utilities.getNav()
    
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding classification failed.")
    res.status(501).render("inventory/addClassification", {
      title: "Classification Registration",
      nav,
      errors: null,
    })
  }
}
/* ****************************************
*  build add inventory view
  * *************************************** */
invCont.buildAddVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  let buildClassificationList = await utilities.buildClassificationList()
  res.render("inventory/addNewInventory", {
    title: "Inventory Register",
    nav,
    buildClassificationList,
    errors: null,
  })
}

/* ****************************************
*  Process new Car register
* *************************************** */
invCont.registerNewInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles, inv_color, } = req.body


  const regResult = await invModel.addNewInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles, 
    inv_color
  )
  

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re Inventory registered a ${inv_make}, ${inv_model}, ${inv_year}.`
    )
    res.status(201).render("inventory/addNewInventory", {
      title: "Inventory Registration",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding Inventory failed.")
    res.status(501).render("inventory/addNewInventory", {
      title: "Inventory Registration",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


module.exports = invCont