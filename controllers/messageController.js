const utilities = require("../utilities/")
const messageController = {}
const database = require("../models/message-model")

messageController.sendMessage = async function (req, res, next) {
    try {
        const { body, recipient_id, inv_id } = req.body

        const sender_id = res.locals.accountData.account_id

        const status = await database.createMessage(body, sender_id, recipient_id, inv_id)

        res.redirect("/inv/detail/" + inv_id)

    } catch (error) {
        next(error)
    }
}

messageController.viewMessages = async function (req, res, next) {

    try {
        const user = req.params.user
        const inv_id = req.params.inv_id

        const messages = await database.viewMessages(user, inv_id)

        res.json(messages)
        
    } catch (error) {
        next(error)
    }

}

module.exports = messageController