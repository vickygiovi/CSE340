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
router.get("/",
    utilities.allowEmployeeOrAdmin,
    invController.buildManagement);
router.get("/addclassification",
    utilities.allowEmployeeOrAdmin,
    invController.addClassification);
router.post("/addclassification",
    utilities.allowEmployeeOrAdmin,
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(invController.postClassification));

router.get("/addinventory",
    utilities.allowEmployeeOrAdmin,
    invController.addInventory);

router.post("/addinventory",
    utilities.allowEmployeeOrAdmin,
    regValidateInventory.registationRules(),
    regValidateInventory.checkRegData,
    utilities.handleErrors(invController.postInventory));

router.get("/getInventory/:classification_id",
    utilities.allowEmployeeOrAdmin,
    utilities.handleErrors(invController.getInventoryJSON))

// Route to load the Edit Inventory View
router.get("/edit/:invid",
    utilities.allowEmployeeOrAdmin,
    utilities.handleErrors(invController.updateInv))

router.post("/update",
    utilities.allowEmployeeOrAdmin,
    regValidateInventory.registationRules(),
    regValidateInventory.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

router.get("/delete/:invid",
    utilities.allowEmployeeOrAdmin,
    utilities.handleErrors(invController.deleteInv)
)

router.post("/delete",
    utilities.allowEmployeeOrAdmin,
    utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;