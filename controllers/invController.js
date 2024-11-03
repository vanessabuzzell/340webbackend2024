const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId 
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
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
    const inv_id = req.params.invId 
    const data = await invCar.getCarDetail(inv_id)
    const grid = await utilities.buildCarDetailGrid(data)
    let nav = await utilities.getNav()
    const carName = data[0].carDetailName
    res.render("./inventory/", {
        title: carName,
        nav,
        grid,
    })

}

module.exports = invCont