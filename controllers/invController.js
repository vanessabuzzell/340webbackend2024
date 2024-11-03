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
    })
}
/* ***************************
 *  Build vehical CarDetail view
 * ************************** */
invCont.buildByCarDetail = async function (req, res, next) {
    let nav = await utilities.getNav()

    const inv_id = req.params.invId 
    const data = await invModel.getCarDetail(inv_id)
    const grid = await utilities.buildCarDetailGrid(data)
    const title = data.inv_make + " "+ data.inv_model
    res.render("./inventory/detail", {
        title: title,
        nav,
        grid,
    })

}

module.exports = invCont