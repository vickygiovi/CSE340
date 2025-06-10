const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const msgModel = require("../models/message-model")
const invModel = require("../models/inventory-model")
const invAccounts = require("../models/account-model")

validate.msgRules = () => {
    return [
        body("body")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Body message is required.")
    ]
}

validate.checkMsgData = async (req, res, next) => {
    const { body } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        
        const sender_id = res.locals.accountData.account_id
        const inventory_id = req.body.inv_id

        const data = await invModel.getInventoryItem(inventory_id)
        const grid = await utilities.buildInventoryItem(data)
        let model = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model

        let nav = await utilities.getNav()

        const dataAccounts = await invAccounts.returnAllAccounts()
        
        let templateAccounts = ""
        templateAccounts += '<select class="submit-msg" name="recipient_id" id="recipient_id">'
        
        dataAccounts.forEach((data) => {
            templateAccounts += `<option value="${data.account_id}">${data.account_firstname} ${data.account_lastname}</option>`
        })

        templateAccounts += '</select>'

        const messages = await msgModel.viewMessages(sender_id, inventory_id)
        
        res.render("./inventory/detail", {
            title: model,
            nav,
            grid,
            inventory_id,
            selectAccount: templateAccounts,
            msgs: { array: () => messages },
            errors
        })

        return
    }
    next()
}

module.exports = validate