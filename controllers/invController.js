const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classificationId = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classificationId)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build vehicle details view
 * ************************** */
invCont.buildVehicleDetailsById = async function (req, res, next) {
    const invId = req.params.invId
    const data = await invModel.getVehicleDetailsById(invId)

    if (!data) {
        return next({ status: 404, message: "Sorry, we couldn't find that vehicle." })
    }
    
    const details = await utilities.buildVehicleDetails(data)
    let nav = await utilities.getNav()
    res.render("./inventory/vehicle-details", {
        title: data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model,
        nav,
        details,
    })
}

module.exports = invCont