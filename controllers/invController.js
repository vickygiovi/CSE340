const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

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
    } catch (error) {
        next(error);
    }

}

invCont.buildManagement = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null
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
            classification_name: null
        })
    } catch (error) {
        next(error);
    }
}

invCont.postClassification = async function (req, res, next) {
    try {
        const { classification_name } = req.body

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
                errors: null
            })
        } else {
            req.flash("notice", "Sorry, the creation of the classification was failed.")
            res.status(501).render("inventory/management", {
                title: "Vehicle Management",
                nav,
                errors: null

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

        if (regResult) {
            req.flash(
                "notice",
                `Added Vehicle ${inv_make} ${inv_model}.`
            )
            res.status(201).render("inventory/management", {
                title: "Vehicle Management",
                nav,
                errors: null
            })
        } else {
            req.flash("notice", "Sorry, the creation of the inventory was failed.")
            res.status(501).render("inventory/management", {
                title: "Vehicle Management",
                nav,
                errors: null

            })
        }
    } catch (error) {
        next(error);
    }
}

module.exports = invCont