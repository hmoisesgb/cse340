const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next){
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +
            '" title = "View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + ' details"><img src="' + vehicle.inv_thumbnail
            + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + ' on CSE Motors" ></a>'
            grid += '<div class="namePrice">'
            grid += '<hr >'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found. </p>'
    }
    return grid
}

/* **************************************
* Build the vehicle details view HTML
* ************************************ */

Util.buildVehicleDetails = async function(data, isFavorite, loggedin){
    let details = '<div id="vehicleDetails">'
    if (data && Object.keys(data).length > 0){
        details += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + ' on CSE Motors" >'
        details += '<div id="vehicleInfoContainer">'
        details += '<h2>' + data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model + ' details </h2>'
        details += '<div id="vehicleInfo">'
        details += '<p><strong>Price: </strong>' + new Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD'}).format(data.inv_price) +'</p>'
        details += '<p><strong>Description: </strong>' + data.inv_description + '</p>'
        details += '<p><strong>Color: </strong>' + data.inv_color + '</p>'
        details += '<p><strong>Miles: </strong>' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p>'
        if(loggedin){
            if(isFavorite){
                details += '<form action="/favorites/remove" method="post">'
                details += `<input type="hidden" name="inv_id" value="${data.inv_id}">`
                details += '<button type="submit" class="removeFavoriteBtn">Remove from Favorites</button>'
                details += '</form>'
            } else {
                details += '<form action="/favorites/add" method="post">'
                details += `<input type="hidden" name="inv_id" value="${data.inv_id}">`
                details += '<button type="submit" class="addFavoriteBtn">Add to Favorites</button>'
                details += '</form>'
            }
        } else {
            details += '<p><a href="/account/login">Log in to add favorites</a></p>'
        }
        details += '</div>'
        details += '</div>'
    }
    else{
        details += '<p class="notice">Sorry, no matching vehicles could be found. </p>'
    }
    details += '</div>'
    return details
}

/* **************************************
* Build classification list for add vehicle view
* ************************************ */
Util.buildClassificationList = async function(classification_id=null){
    let data = await invModel.getClassifications()
    let classificationList = '<select name="classification_id" id="classificationList" required>'
    classificationList += '<option value="">Choose a Classification</option>'
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (classification_id != null && row.classification_id == classification_id){
            classificationList += ' selected '
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += '</select>'
    return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req,res,next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
        req.cookies.jwt,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, accountData) {
            if (err) {
            req.flash("Please log in")
            res.clearCookie("jwt")
            return res.redirect("/account/login")
            }
            res.locals.accountData = accountData
            res.locals.loggedin = 1
            next()
        })
    } else {
        next()
    }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin){
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

/* ****************************************
* Middleware to check account type
**************************************** */
Util.checkAccountType = (req, res, next) => {
    if (res.locals.accountData.account_type === "Admin" || res.locals.accountData.account_type === "Employee"){
        next()
    } else {
        req.flash("notice", "You do not have permission to access this page.")
        return res.redirect("/")
    }
}

/* **************************************
* Build the HTML for the favorites view
* ************************************ */
Util.buildFavoritesHTML = async function(data) {
    let container
    if (data.length > 0) {
        container = '<div class="card-container">'
        data.forEach(vehicle => {
            container += '<div class="favoriteCard">'
            container += '<img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" >'
            container += '<h2>' + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' </h2>'
            container += '<p><strong>Price: </strong>' + new Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD'}).format(vehicle.inv_price) +'</p>'
            container += '<p><strong>Color: </strong>' + vehicle.inv_color + '</p>'
            container += '<p><strong>Miles: </strong>' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
            container += '<a class="detailsBtn" href="../../inv/detail/' + vehicle.inv_id + '" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + 'View Vehicle Details </a>'
            container += '<form action="/favorites/remove" method="post">'
            container += `<input type="hidden" name="inv_id" value="${vehicle.inv_id}">`
            container += '<button type="submit" class="removeFavoriteBtn">Remove from Favorites</button>'
            container += '</form>'
            container += '</div>'
        }
        )
        container += '</div>'
    } else {
        container = '<p class="notice"> No favorites could be found </p>'
    }
    return container
}

module.exports = Util