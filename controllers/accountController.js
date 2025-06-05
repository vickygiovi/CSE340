const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")
require("dotenv").config()

async function accountManagement(req, res) {
    const nav = await utilities.getNav();
    req.flash("notice", "You're logged in")
    res.status(200).render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
    })
}


/* ****************************************
*  Deliver login view
* *************************************** */

async function buildLogin(req, res, next) {

    try {
        let nav = await utilities.getNav()
        res.render("account/login", {
            title: "Login",
            nav,
            errors: null
        })
    } catch (error) {
        next(error);
    }

}

/* ****************************************
*  Deliver registration view
* *************************************** */

async function buildRegister(req, res, next) {


    try {
        let nav = await utilities.getNav()
        res.render("account/register", {
            title: "Register",
            nav,
            errors: null,
        })
    } catch (error) {
        next(error)
    }
}



/* ****************************************
*  Process Registration
* *************************************** */

async function registerAccount(req, res) {
    try {
        let nav = await utilities.getNav()
        const { account_firstname, account_lastname, account_email, account_password } = req.body

        // Hash the password before storing

        let hashedPassword
        try {
            // regular password and cost (salt is generated automatically)
            hashedPassword = await bcrypt.hashSync(account_password, 10)
        } catch (error) {
            req.flash("notice", 'Sorry, there was an error processing the registration.')
            res.status(500).render("account/register", {
                title: "Registration",
                nav,
                errors: null,
            })
        }

        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword
        )

        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you\'re registered ${account_firstname}. Please log in.`
            )
            res.status(201).render("account/login", {
                title: "Login",
                nav,
                errors: null
            })
        } else {
            req.flash("notice", "Sorry, the registration failed.")
            res.status(501).render("account/register", {
                title: "Registration",
                nav,
                errors: null
            })
        }
    } catch (error) {
        next(error)
    }

}

/* ****************************************
 *  Process login request
 * ************************************ */

async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            // req.flash("notice", "You're logged in")
            // res.status(200).render("account/management", {
            //     title: "Account Management",
            //     nav,
            //     errors: null,
            //     account_email,
            // })

            res.redirect("/account/management");
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

async function buildUpdateUser(req, res) {
    try {
        const { id } = req.params
        let nav = await utilities.getNav()
        res.render("account/update", {
            title: "Update User",
            nav,
            errors: null,
            account_firstname: null,
            account_lastname: null,
            account_email: null,
            id,

        })
    } catch (error) {
        next(error)
    }
}

async function updateUser(req, res, next) {
    try {
        let nav = await utilities.getNav()
        const { account_firstname, account_lastname, account_email, account_id } = req.body


        const regResult = await accountModel.updateAccount(
            account_id,
            account_firstname,
            account_lastname,
            account_email,
        )

        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you\'re updated your account, ${account_firstname}. Please log in.`
            )
            res.status(201).render("account/management", {
                title: "Account Management",
                nav,
                errors: null
            })
        } else {
            req.flash("notice", "Sorry, the update failed.")
            res.status(501).render("account/management", {
                title: "Account Management",
                nav,
                errors: null
            })
        }
    } catch (error) {
        next(error)
    }
}

async function updatePassword(req, res, next) {
    try {

        let nav = await utilities.getNav()
        const { account_password, account_id } = req.body

        let hashedPassword = await bcrypt.hashSync(account_password, 10)

        const regResult = await accountModel.changePasswordAccount(
            account_id,
            hashedPassword,
        )

        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you\'re updated your password. Please log in.`
            )
            res.status(201).render("account/management", {
                title: "Account Management",
                nav,
                errors: null,
            })
        } else {
            req.flash("notice", "Sorry, the password update failed.")
            res.status(501).render("account/management", {
                title: "Account Management",
                nav,
                errors: null
            })
        }

    } catch (error) {
        next(error)
    }
}

function logout(req, res) {
    try {
        res.clearCookie("jwt")
        res.redirect("/")
    } catch (error) {
        next(error)
    }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildUpdateUser, updateUser, updatePassword, logout, accountManagement }