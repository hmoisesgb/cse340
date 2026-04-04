const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")

const invValidation = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
invValidation.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isAlpha()
            .withMessage("Please provide a classification name that only contains letters.")
    ]
}

/*  **********************************
  *  Check data and return errors or continue to add classification
  * ********************************* */
invValidation.checkClassificationData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
        })
        return
    }
    next()
}

/*  **********************************
  *  Vehicle Data Validation Rules
  * ********************************* */
invValidation.vehicleRules = () => {
    return [
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a make for the vehicle."),
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a model for the vehicle."),
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isInt({ min: 1800, max: 2100 })
            .withMessage("Please provide a valid year for the vehicle."),
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 5 })
            .withMessage("Please provide a description for the vehicle."),
        body("inv_image")
            .trim()
            .notEmpty()
            .matches(/\.(png|jpg|jpeg|webp)$/)
            .withMessage("Image path must end with .png, .jpg, .jpeg or .webp"),
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .matches(/\.(png|jpg|jpeg|webp)$/)
            .withMessage("Thumbnail path must end with .png, .jpg, .jpeg or .webp"),
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isInt({ min: 0 })
            .withMessage("Please provide a valid price for the vehicle."),
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isInt()
            .withMessage("Please provide valid mileage for the vehicle."),
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a color for the vehicle."),
    ]
}

/*  **********************************
  *  Check data and return errors or continue to add vehicle
  * ********************************* */
invValidation.checkVehicleData = async (req, res, next) => {
    const errors = validationResult(req)
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classifications = await utilities.buildClassificationList(classification_id)
        res.render("./inventory/add-vehicle", {
            errors,
            title: "Add Vehicle",
            nav,
            classificationList: classifications,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}

module.exports = invValidation