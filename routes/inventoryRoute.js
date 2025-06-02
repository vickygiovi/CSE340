// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const regValidate = require("../utilities/classification-validation")
const regValidateInventory = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildInventoryItem);
router.get("/", invController.buildManagement);
router.get("/addclassification", invController.addClassification);
router.post("/addclassification",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(invController.postClassification));

router.get("/addinventory", invController.addInventory);

router.post("/addinventory",
    regValidateInventory.registationRules(),
    regValidateInventory.checkRegData,
    utilities.handleErrors(invController.postInventory));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to load the Edit Inventory View
router.get("/edit/:invid", utilities.handleErrors(invController.updateInv))

router.post("/update",
    regValidateInventory.registationRules(),
    regValidateInventory.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

module.exports = router;