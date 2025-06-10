const pool = require("../database/")

async function createMessage(body, from, to, inv) {
    try {
        const query = {
            name: 'send-message',
            text: 'INSERT INTO message (body, sender_id, recipient_id, inv_id) VALUES ($1, $2, $3, $4);',
            values: [body, from, to, inv],
        }

        const data = await pool.query(query)

        return data
    } catch (error) {
        console.error("create error " + error)
    }
}

async function viewMessages(user, inv_id) {
    try {
        const query = {
            name: 'view-messages',
            text: `
                SELECT message.body, message.sender_id, message.recipient_id, message.inv_id, a1.account_firstname as FirstNameSender, a1.account_lastname as LastNameSender, a2.account_firstname as FirstNameRecipient, a2.account_lastname as LastNameRecipient
FROM message
INNER JOIN account a1 ON (message.sender_id = a1.account_id)
INNER JOIN account a2 ON (message.recipient_id = a2.account_id)
WHERE (recipient_id = $1 OR sender_id = $2) AND inv_id = $3;
            `,
            values: [user, user, inv_id],
        }

        const data = await pool.query(query)

        return data.rows
    } catch (error) {
        console.error("view error " + error)
    }
}

module.exports = { createMessage, viewMessages }