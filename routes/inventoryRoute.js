// Needed Resources
const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController')
const invValidation = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get('/type/:classificationId', invController.buildByClassificationId);
// Route to build vehicle details view
router.get('/detail/:invId', invController.buildVehicleDetailsById);
// Route to build management view
router.get('/', invController.buildManagement);
// Route to build add classification view
router.get('/addClassification', invController.buildAddClassification);
// Route to add a new classification
router.post('/addClassification',
    invValidation.classificationRules(),
    invValidation.checkClassificationData,
    invController.addClassification
)
// Route to build add vehicle view
router.get('/addVehicle', invController.buildAddVehicle);
// Route to add a new vehicle
router.post('/addVehicle',
    invValidation.vehicleRules(),
    invValidation.checkVehicleData,
    invController.addVehicle
)
module.exports = router;