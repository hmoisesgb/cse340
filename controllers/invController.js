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
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
        title: "Management View",
        nav,
        classificationSelect,})
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
    const classificationSelect = await utilities.buildClassificationList()
    if (regResult) {
        let nav = await utilities.getNav()
        req.flash(
            "notice",
            `Contratulations, you\'ve added the ${classification_name} classification.`
        )
        res.status(201).render("./inventory/management", {
            title: "Management View",
            nav,
            classificationSelect,
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
    const classificationSelect = await utilities.buildClassificationList()
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
            classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */

invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classificationId)
    console.log("classification_id is: " + classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id){
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* ****************************************
*  Build edit vehicle view
* *************************************** */
invCont.buildEditVehicle = async function(req, res, next){
    const inv_id = parseInt(req.params.inv_id)
    const invData = await invModel.getVehicleDetailsById(inv_id)
    if (!invData) {
        return next({ status: 404, message: "Sorry, we couldn't find that vehicle." })
    }
    let nav = await utilities.getNav()
    let classifications = await utilities.buildClassificationList(classification_id=invData.classification_id)
    res.render("./inventory/edit-vehicle", {
        title: "Edit " + invData.inv_make + " " + invData.inv_model,
        nav,
        classificationList: classifications,
        inv_id: invData.inv_id,
        inv_make: invData.inv_make,
        inv_model: invData.inv_model,
        inv_year: invData.inv_year,
        inv_description: invData.inv_description,
        inv_image: invData.inv_image,
        inv_thumbnail: invData.inv_thumbnail,
        inv_price: invData.inv_price,
        inv_miles: invData.inv_miles,
        inv_color: invData.inv_color,
        errors: null
    })
}

/* ***************************
 *  Update Vehicle Data
 * ************************** */
invCont.updateVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  )

  if (updateResult) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + inv_make + " " + inv_model,
    nav,
    classificationSelect: classificationSelect,
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

/* ****************************************
*  Build delete confirmation view
* *************************************** */
invCont.buildDeleteVehicle = async function(req, res, next){
    const inv_id = parseInt(req.params.inv_id)
    const invData = await invModel.getVehicleDetailsById(inv_id)
    if (!invData) {
        return next({ status: 404, message: "Sorry, we couldn't find that vehicle." })
    }
    let nav = await utilities.getNav()
    res.render("./inventory/delete-confirmation", {
        title: "Delete " + invData.inv_make + " " + invData.inv_model,
        nav,
        errors:null,
        inv_id: invData.inv_id,
        inv_make: invData.inv_make,
        inv_model: invData.inv_model,
        inv_year: invData.inv_year,
        inv_price: invData.inv_price,
    })
}

/* ***************************
 *  Delete Vehicle Data
 * ************************** */
invCont.deleteVehicle = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { inv_id, inv_make, inv_model, inv_year, inv_price } = req.body
    const deleteResult = await invModel.deleteVehicle(inv_id)
    if (deleteResult) {
        req.flash("notice", `The ${inv_make} ${inv_model} was successfully deleted.`)
        res.redirect("/inv/")
    } else {
        req.flash("notice", "Sorry, the deletion failed.")
        res.status(501).render("inventory/delete-confirmation", {
        title: "Delete " + inv_make + " " + inv_model,
        nav,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
    })
    }
}
module.exports = invCont