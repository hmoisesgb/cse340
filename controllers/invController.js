const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classificationId = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classificationId)
    if (!data || !data[0]) {
        return next({ status: 404, message: "Sorry, we couldn't find any vehicles in that classification." })
    }
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

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Management View",
        nav})
}

/*  **********************************
  *  Build add classification view
  * ********************************* */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null})
}

/*  **********************************
  *  Build add vehicle view
  * ********************************* */
invCont.buildAddVehicle = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classifications = await utilities.buildClassificationList()
    res.render("./inventory/add-vehicle", {
        title: "Add Vehicle",
        nav,
        errors: null,
        classificationList: classifications})
}

/* ****************************************
*  Process add classification
* *************************************** */
invCont.addClassification = async function (req, res) {
    const { classification_name } = req.body
    const regResult = await invModel.createClassification(classification_name)
    if (regResult) {
        let nav = await utilities.getNav()
        req.flash(
            "notice",
            `Contratulations, you\'ve added the ${classification_name} classification.`
        )
        res.status(201).render("./inventory/management", {
            title: "Management View",
            nav,
        })
    }
    else{
        let nav = await utilities.getNav()
        req.flash("notice", "Sorry, there was an error processing the classification addition.")
        res.status(501).render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null})
    }
}

/* ****************************************
*  Process add vehicle
* *************************************** */
invCont.addVehicle = async function (req, res) {
    let nav = await utilities.getNav()
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
        classification_id
    } = req.body
    const regResult = await invModel.createVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'ve added the ${inv_year} ${inv_make} ${inv_model} vehicle.`
        )
        res.status(201).render("./inventory/management", {
            title: "Management View",
            nav,
        })
    }
    else{
        let classifications = await utilities.buildClassificationList()
        req.flash("notice", "Sorry, there was an error processing the vehicle addition.")
        res.status(501).render("./inventory/add-vehicle", {
            title: "Add Vehicle",
            nav,
            errors: null,
            classificationList: classifications})
    }
}

module.exports = invCont