// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
//router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

router.get("/", utilities.handleErrors(invController.buildManagement))
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))
router.get("/addVehicle", utilities.handleErrors(invController.buildAddVehicle))
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:invId", utilities.handleErrors(invController.buildEditInventory))

router.post(
    "/addClassification",
    invValidate.addClassificationRules(),
    invValidate.checkAddClassificationData,
    utilities.handleErrors(invController.addClassification)
);

router.post(
    "/addVehicle",
    invValidate.addVehicleRules(),
    invValidate.checkAddVehicleData,
    utilities.handleErrors(invController.addVehicle)
);

router.post(
    "/update/:invId", 
    invValidate.addVehicleRules(),
    invValidate.checkAddVehicleData,
    utilities.handleErrors(invController.updateInventory)
)

module.exports = router;