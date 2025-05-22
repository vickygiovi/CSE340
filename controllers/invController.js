const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

invCont.buildInventoryItem = async function (req, res, next) {
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventoryItem(inventory_id)
    const grid = await utilities.buildInventoryItem(data)
    let nav = await utilities.getNav()

    let model = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model

    res.render("./inventory/detail", {
        title: model,
        nav,
        grid,
    })
}


module.exports = invCont