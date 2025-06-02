const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.accountLogin)
)
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// ROUTE REGISTER SUBMIT FORM VIA POST
router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

router.get("/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.accountLogin))

module.exports = router