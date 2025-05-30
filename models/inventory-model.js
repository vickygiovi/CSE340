const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */

async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */

async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

async function getInventoryItem(inventory_id) {
    try {
        // const data = await pool.query(
        //     `SELECT * FROM public.inventory WHERE inv_id = $1`,
        //     [inventory_id]
        // )

        const query = {
            // give the query a unique name
            name: 'get-inv-item',
            text: 'SELECT * FROM public.inventory WHERE inv_id = $1',
            values: [inventory_id],
        }

        const data = await pool.query(query)

        return data.rows
    } catch (error) {
        console.error("getinventorydetail error " + error)
    }
}

async function addClassification(classification_name) {

    // try {
    //     const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    //     return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    // } catch (error) {
    //     return error.message
    // }

    try {
        // const data = await pool.query(
        //     `SELECT * FROM public.inventory WHERE inv_id = $1`,
        //     [inventory_id]
        // )

        const query = {
            // give the query a unique name
            name: 'add-classification',
            text: 'INSERT INTO public.classification (classification_name) VALUES ($1);',
            values: [classification_name],
        }

        const data = await pool.query(query)

        return data
    } catch (error) {
        console.error("addclassification error " + error)
    }
}

async function addInventory(inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color, classification_id) {
    try {
        // const data = await pool.query(
        //     `SELECT * FROM public.inventory WHERE inv_id = $1`,
        //     [inventory_id]
        // )

        const query = {
            // give the query a unique name
            name: 'add-inventory',
            text: `
                INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
            `,
            values: [inv_make,
                inv_model,
                inv_year,
                inv_description,
                inv_image,
                inv_thumbnail,
                inv_price,
                inv_miles,
                inv_color, classification_id],
        }

        const data = await pool.query(query)

        return data
    } catch (error) {
        console.error("addinventory error " + error)
    }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryItem, addClassification, addInventory };