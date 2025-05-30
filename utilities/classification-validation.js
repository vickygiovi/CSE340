const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.registationRules = () => {
    return [
        // firstname is required and must be string
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Field required")
            .isLength({ min: 1 })
            .withMessage("At least 1 character in length")
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("Please provide a valid classification name.") // on error this message is sent.
    ]
}

validate.checkRegData = async (req, res, next) => {
    const { classification_name } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

module.exports = validate