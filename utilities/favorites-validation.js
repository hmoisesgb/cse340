const utilities = require(".")
const invModel = require("../models/inventory-model")
const favModel = require("../models/favorites-model")

const { body, validationResult} = require("express-validator")
const validate = {}

/*  **********************************
  *  Favorite validation rules
  * ********************************* */
 validate.favoriteRules = () => {
    return [
    body("inv_id")
      .trim()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Invalid vehicle ID.")
      .custom(async (inv_id) => {
        const vehicle = await invModel.getVehicleDetailsById(inv_id)
        if (!vehicle) {
          throw new Error("Vehicle does not exist.")
        }
      })
  ]
 }

/* ******************************
 * Check data and return errors or continue with adding or removing a favorite
 * ***************************** */
validate.checkFavoriteData = async (req, res, next) => {
    const { inv_id } = req.body
    const account_id = req.res.locals.accountData.account_id
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const data = await favModel.getFavoriteVehiclesByAccountId(account_id)
        const favorites = await utilities.buildFavoritesHTML(data)
        res.render("./favorites/favorites", {
            title: "Favorite Vehicles",
            nav,
            favorites,
            errors,
        })
        return
    }
    next()
}

module.exports = validate