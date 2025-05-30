const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */

Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    console.log(data)
    let list = "<ul class='navigation'>"
    list += '<li><a class="aNav" href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a class="aNav" href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */

Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display" class="gridInv">'
        data.forEach(vehicle => {
            grid += '<li class="liInv">'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="view ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a class="h2Vehicle" href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span class="price">$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

Util.buildInventoryItem = async function (data) {
    // let details = '<h2>'
    // details += data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
    // details += '</h2>'

    let details = '<div class="grid-detail">'
    details += '<img class="img-detail" alt="Vehicle image" src="' + data[0].inv_image + '">'
    details += '<div>'
    details += '<h2>'
    details += data[0].inv_make + ' ' + data[0].inv_model + ' Details'
    details += '</h2>'
    details += '<span class="span-detail">'
    details += 'Price: $' + new Intl.NumberFormat('en-US').format(data[0].inv_price)
    details += '</span>'

    details += '<p>'
    details += '<span class="span-detail">Description: </span>'
    details += data[0].inv_description
    details += '</p>'

    details += '<p>'
    details += '<span class="span-detail">Color: </span>'
    details += data[0].inv_color
    details += '</p>'

    details += '<p>'
    details += '<span class="span-detail">Miles: </span>'
    details += new Intl.NumberFormat('en-US').format(data[0].inv_miles)
    details += '</p>'

    details += '</div>'
    details += '</div>'

    return details
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}



module.exports = Util