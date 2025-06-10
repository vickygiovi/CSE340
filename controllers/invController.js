const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invAccounts = require("../models/account-model")
const messageModel = require("../models/message-model")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    try {
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
    } catch (error) {
        next(error);
    }

}

invCont.buildInventoryItem = async function (req, res, next) {
    try {

        const sender_id = res.locals.accountData.account_id
        
        const inventory_id = req.params.inventoryId

        const messages = await messageModel.viewMessages(sender_id, inventory_id)

        const dataAccounts = await invAccounts.returnAllAccounts()

        let templateAccounts = ""
        templateAccounts += '<select class="submit-msg" name="recipient_id" id="recipient_id">'
        
        dataAccounts.forEach((data) => {
            templateAccounts += `<option value="${data.account_id}">${data.account_firstname} ${data.account_lastname}</option>`
        })

        templateAccounts += '</select>'


        const data = await invModel.getInventoryItem(inventory_id)
        const grid = await utilities.buildInventoryItem(data)
        let nav = await utilities.getNav()

        let model = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model

        res.render("./inventory/detail", {
            title: model,
            nav,
            grid,
            inventory_id,
            selectAccount: templateAccounts,
            msgs: { array: () => messages },
            errors: { array: () => [] }
        })
    } catch (error) {
        next(error);
    }

}

invCont.buildManagement = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        const classificationSelect = await utilities.buildClassificationList()

        res.render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
            classificationSelect
        })
    } catch (error) {
        next(error);
    }
}

invCont.addClassification = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
            classification_name: null,
            
        })
    } catch (error) {
        next(error);
    }
}

invCont.postClassification = async function (req, res, next) {
    try {
        const { classification_name } = req.body

        const classificationSelect = await utilities.buildClassificationList()

        const regResult = await invModel.addClassification(
            classification_name
        )

        let nav = await utilities.getNav()


        if (regResult) {
            req.flash(
                "notice",
                `Added Classification ${classification_name}.`
            )
            res.status(201).render("inventory/management", {
                title: "Vehicle Management",
                nav,
                errors: null,
                classificationSelect
            })
        } else {
            req.flash("notice", "Sorry, the creation of the classification was failed.")
            res.status(501).render("inventory/management", {
                title: "Vehicle Management",
                nav,
                errors: null,
                classificationSelect

            })
        }
    } catch (error) {
        next(error);
    }
}

invCont.addInventory = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        let classificationSelect = await utilities.buildClassificationList()
        res.render("./inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            errors: null,
            inv_make: null,
            inv_model: null,
            inv_year: null,
            inv_description: null,
            inv_image: null,
            inv_thumbnail: null,
            inv_price: null,
            inv_miles: null,
            inv_color: null,
            classificationSelect,
        })
    } catch (error) {
        next(error);
    }

}

invCont.postInventory = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        const { inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color, classification_id } = req.body

        const regResult = await invModel.addInventory(
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color, classification_id
        )

        const classificationSelect = await utilities.buildClassificationList()

        if (regResult) {
            req.flash(
                "notice",
                `Added Vehicle ${inv_make} ${inv_model}.`
            )
            res.status(201).render("inventory/management", {
                title: "Vehicle Management",
                nav,
                errors: null,
                classificationSelect
            })
        } else {
            req.flash("notice", "Sorry, the creation of the inventory was failed.")
            res.status(501).render("inventory/management", {
                title: "Vehicle Management",
                nav,
                errors: null,
                classificationSelect

            })
        }
    } catch (error) {
        next(error);
    }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */

invCont.updateInv = async function (req, res, next) {
    try {
        const inv_id = parseInt(req.params.invid)
        let nav = await utilities.getNav()
        const itemData = await invModel.getInventoryItem(inv_id)
        const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
        const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
        res.render("./inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            inv_id: itemData[0].inv_id,
            inv_make: itemData[0].inv_make,
            inv_model: itemData[0].inv_model,
            inv_year: itemData[0].inv_year,
            inv_description: itemData[0].inv_description,
            inv_image: itemData[0].inv_image,
            inv_thumbnail: itemData[0].inv_thumbnail,
            inv_price: itemData[0].inv_price,
            inv_miles: itemData[0].inv_miles,
            inv_color: itemData[0].inv_color,
            classification_id: itemData[0].classification_id
        })
    } catch (error) {
        next(error);
    }

}

/* ***************************
 *  Carry out update
 * ************************** */

invCont.updateInventory = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        const {
            inv_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
        } = req.body
        const updateResult = await invModel.updateInventory(
            inv_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id
        )

        if (updateResult) {
            const itemName = updateResult.inv_make + " " + updateResult.inv_model
            req.flash("notice", `The ${itemName} was successfully updated.`)
            res.redirect("/inv")
        } else {
            const classificationSelect = await utilities.buildClassificationList(classification_id)
            const itemName = `${inv_make} ${inv_model}`
            req.flash("notice", "Sorry, the insert failed.")
            res.status(501).render("inventory/edit-inventory", {
                title: "Edit " + itemName,
                nav,
                classificationSelect: classificationSelect,
                errors: null,
                inv_id,
                inv_make,
                inv_model,
                inv_year,
                inv_description,
                inv_image,
                inv_thumbnail,
                inv_price,
                inv_miles,
                inv_color,
                classification_id
            })
        }
    } catch (error) {
        next(error);
    }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */

invCont.deleteInv = async function (req, res, next) {
    try {
        const inv_id = parseInt(req.params.invid)


        let nav = await utilities.getNav()


        const itemData = await invModel.getInventoryItem(inv_id)


        const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`


        // const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
        
        res.render("./inventory/delete-confirm", {
            title: "Delete " + itemName,
            nav,
            errors: null,
            inv_id: itemData[0].inv_id,
            inv_make: itemData[0].inv_make,
            inv_model: itemData[0].inv_model,
            inv_year: itemData[0].inv_year,
            inv_price: itemData[0].inv_price,
        })
    } catch (error) {
        next(error);
    }
}

/* ***************************
 *  Carry out delete
 * ************************** */

invCont.deleteInventory = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        const {
            inv_id
        } = req.body

        

        const updateResult = await invModel.deleteInventory(
            parseInt(inv_id),
        )

        if (updateResult) {
            const itemName = updateResult.inv_make + " " + updateResult.inv_model
            req.flash("notice", `The ${itemName} was successfully deleted.`)
            res.redirect("/inv")
        } else {
            const itemName = `${inv_make} ${inv_model}`
            req.flash("notice", "Sorry, the delete failed.")
            res.status(501).render("inventory/delete-confirm", {
                title: "Delete  " + itemName,
                nav,
                errors: null,
                inv_id,
                inv_make: updateResult.inv_make,
                inv_model: updateResult.inv_model,
                inv_year: updateResult.inv_year,
                inv_price: updateResult.inv_price,
            })
        }
    } catch (error) {
        next(error);
    }
}



module.exports = invCont