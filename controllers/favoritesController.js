const favModel = require("../models/favorites-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

/* ***************************
 *  Build favorites view
 * ************************** */
async function buildFavorites(req, res, next){
    const account_id = res.locals.accountData.account_id
    const data = await favModel.getFavoriteVehiclesByAccountId(account_id)
    const favorites = await utilities.buildFavoritesHTML(data)
    let nav = await utilities.getNav()
    res.render("./favorites/favorites", {
        title: "Favorite Vehicles",
        nav,
        favorites,
        errors:null,
    })
}

/* ***************************
 *  Add a favorite
 * ************************** */
async function addFavorite (req, res, next){
    try {
        const {inv_id} = req.body
        const account_id = res.locals.accountData.account_id
        const exists = await favModel.checkFavorite(account_id,inv_id)
        if (exists){
            req.flash("notice", "The vehicle is already in your favorites")
            return res.redirect("/favorites/")
        }

        const result = await favModel.addToFavorites(account_id,inv_id)

        if(result && result.rowCount > 0){
            const vehicleData = await invModel.getVehicleDetailsById(inv_id)
            req.flash("notice", `Added ${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model} to favorites.`)
            return res.redirect("/favorites/")
        }
        else {
            req.flash("notice", "Sorry, there was an error adding the favorite")
            return res.redirect("/favorites/")
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}

/* ***************************
 *  Remove a favorite
 * ************************** */
async function removeFavorite(req, res, next){
    try {
        const {inv_id} = req.body
        const account_id = res.locals.accountData.account_id
        const exists = await favModel.checkFavorite(account_id,inv_id)

        if(!exists){
            req.flash("notice", "The vehicle is not in your favorites")
            return res.redirect("/favorites/")
        }

        const result = await favModel.deleteFromFavorites(account_id,inv_id)
        if(result && result.rowCount > 0){
            const vehicleData = await invModel.getVehicleDetailsById(inv_id)
            req.flash("notice", `Removed ${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model} from favorites.`)
            return res.redirect("/favorites/")
        }
        else {
            req.flash("notice", "Sorry, there was an error removing the favorite")
            return res.redirect("/favorites/")
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}
module.exports = { buildFavorites, addFavorite, removeFavorite }