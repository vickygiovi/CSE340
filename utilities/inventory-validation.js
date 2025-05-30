const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.registationRules = () => {
    return [
        // firstname is required and must be string
        body("inv_make")
            .trim()
            .escape()
            .isLength({ min: 3 })
            .withMessage("Make field must be minimum 3 characters")
            .notEmpty()
            .withMessage("Make required"),
        body("inv_model")
            .trim()
            .escape()
            .isLength({ min: 3 })
            .withMessage("Model field must be minimum 3 characters")
            .notEmpty()
            .withMessage("Model required"),
        body("inv_year")
            .trim()
            .escape()
            .isNumeric()
            .withMessage("Only digits in field year")
            .isLength({ min: 4, max: 4 })
            .withMessage("4 digits required in field year")
            .notEmpty()
            .withMessage("Year required"),
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Description required"),
        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Image required"),
        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Thumbnail required"),
        body("inv_price")
            .trim()
            .escape()
            .isNumeric()
            .withMessage("Only digits in price field")
            .notEmpty()
            .withMessage("Price required"),
        body("inv_miles")
            .trim()
            .escape()
            .isNumeric()
            .withMessage("Only digits in miles field")
            .notEmpty()
            .withMessage("Miles required"),
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Color required"),
    ]
}

validate.checkRegData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

    const classificationSelect = await utilities.buildClassificationList(classification_id)


    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Inventory",
            nav,
            classificationSelect,
            inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
        })
        return
    }
    next()
}

module.exports = validate