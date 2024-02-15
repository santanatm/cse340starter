// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require('../utilities/inventory-validation')
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));
router.get("/", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));
router.get("/addVehicle",utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddVehicle));
router.get("/addClassification", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));
router.get("/deleteClassification", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteClassification));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:invId", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildEditInventory))
router.get("/delete/:invId", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteInventory))

router.post(
    "/addClassification",
    invValidate.addClassificationRules(),
    invValidate.checkAddClassificationData,
    utilities.handleErrors(invController.addClassification)
);

router.post(
    "/deleteClassification",
    invValidate.deleteClassificationRules(),
    invValidate.checkDeleteClassificationData,
    utilities.handleErrors(invController.deleteClassification)
);

router.post(
    "/addVehicle",
    utilities.checkLogin, 
    utilities.checkAccountType,
    invValidate.addVehicleRules(),
    invValidate.checkAddVehicleData,
    utilities.handleErrors(invController.addVehicle)
);

router.post(
    "/update", 
    utilities.checkLogin, 
    utilities.checkAccountType,
    invValidate.addVehicleRules(),
    invValidate.checkUpdateVehicleData,
    utilities.handleErrors(invController.updateInventory)
)

router.post(
    "/delete",
    utilities.checkLogin, 
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventory)
)



module.exports = router;