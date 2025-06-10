const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const msgValidation = require("../utilities/msg-validation")
const controller = require("../controllers/messageController")

router.post("/send", 
    msgValidation.msgRules(),
    msgValidation.checkMsgData,
    utilities.handleErrors(controller.sendMessage))

router.get("/view/:user/:inv_id", utilities.handleErrors(controller.viewMessages))

module.exports = router