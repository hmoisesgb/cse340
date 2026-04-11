// Needed Resources
const express = require('express');
const router = express.Router();
const utilities = require("../utilities")
const invController = require('../controllers/invController')
const invValidation = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get('/type/:classificationId', invController.buildByClassificationId);
// Route to build vehicle details view
router.get('/detail/:invId', invController.buildVehicleDetailsById);
// Route to build management view
router.get('/', utilities.checkLogin, utilities.checkAccountType, invController.buildManagement);
// Route to build add classification view
router.get('/addClassification', utilities.checkLogin, utilities.checkAccountType, invController.buildAddClassification);
// Route to add a new classification
router.post('/addClassification',
    utilities.checkLogin,
    utilities.checkAccountType,
    invValidation.classificationRules(),
    invValidation.checkClassificationData,
    invController.addClassification
)
// Route to build add vehicle view
router.get('/addVehicle', utilities.checkLogin, utilities.checkAccountType, invController.buildAddVehicle);
// Route to add a new vehicle
router.post('/addVehicle',
    utilities.checkLogin,
    utilities.checkAccountType,
    invValidation.vehicleRules(),
    invValidation.checkVehicleData,
    invController.addVehicle
)
// Route to get inventory data
router.get('/getInventory/:classificationId', utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON))
// Route to build edit vehicle view
router.get('/edit/:inv_id', utilities.checkAccountType, utilities.checkLogin, utilities.handleErrors(invController.buildEditVehicle))
// Route to process vehicle updates
router.post('/update',
    utilities.checkLogin,
    utilities.checkAccountType,
    invValidation.vehicleRules(),
    invValidation.checkUpdateData,
    utilities.handleErrors(invController.updateVehicle)
)
// Route to build delete confirmation view
router.get('/delete/:inv_id', utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteVehicle))
// Route to process vehicle deletion
router.post('/delete',
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteVehicle)
)
module.exports = router;