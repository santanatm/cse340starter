// Needed Resources 
const express = require("express")
const router = new express.Router() 
const detController = require("../controllers/detController")

// Route to build inventory by id view
router.get("/detail/:inventoryId", detController.buildByInventoryId);

module.exports = router;