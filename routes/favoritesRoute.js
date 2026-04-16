const express = require('express');
const router = express.Router();
const utilities = require("../utilities")
const favController = require('../controllers/favoritesController')
const favValidator = require("../utilities/favorites-validation")

// Route to build favorites view
router.get('/', utilities.checkLogin, utilities.handleErrors(favController.buildFavorites))
// Route to add a new favorite
router.post('/add', utilities.checkLogin, favValidator.favoriteRules(), favValidator.checkFavoriteData, utilities.handleErrors(favController.addFavorite))
// Route to delete a favorite
router.post('/remove', utilities.checkLogin, favValidator.favoriteRules(), favValidator.checkFavoriteData, utilities.handleErrors(favController.removeFavorite))

module.exports= router;