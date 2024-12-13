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
    const classificationList = await utilities.buildClassificationList()
    res.render("inventory/management", {
        title: 'Inventory Managment',
        nav,
        classificationList,
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
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/addNewInventory", {
    title: "Inventory Register",
    nav,
    classificationList,
    errors: null,
  })
}

/* ****************************************
*  Process new Car register
* *************************************** */
invCont.registerNewInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body


  const regResult = await invModel.addNewInventory(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );
  

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re Inventory registered a ${inv_make}, ${inv_model}, ${inv_year}.`
    )
    res.render("inventory/management", {
      title: "Inventory Registration",
      nav,
      classificationList,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding Inventory failed.")
    res.render("inventory/addNewInventory", {
      title: "Inventory Registration",
      nav,
      classificationList,
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
/* ***************************
 *  Build update inventory view
 * ************************** */
invCont.updateInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemDataArray = await invModel.getInventoryByClassificationId(inv_id)
  const itemData = itemDataArray[0];
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  console.log("Rendering edit-inventory view with data:", itemData);
  res.render("./inventory/updateInventory", {
    title: "Update " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/updateInventory", {
    title: "Update " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id,
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
  }
}
/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const data = await invModel.buildByCarDetail(inv_id)
  const itemName = `${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete Confirmatiion " + itemName,
    nav,
    errors: null,
    inv_id: data[0].inv_id,
    inv_make: data[0].inv_make,
    inv_model: data[0].inv_model,
    inv_year: data[0].inv_year,
    inv_price: data[0].inv_price

  })
}
/* ***************************
 *  delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.deleteInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully delete.`)
    res.redirect("/inv/")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id,
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
  }
}
module.exports = invCont