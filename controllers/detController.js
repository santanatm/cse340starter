const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by Detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryById(inventory_id)
  const grid = await utilities.buildInventoryDetail(data)
  let nav = await utilities.getNav()
  const TitleName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  res.render("./detail/details", {
    title: TitleName,
    nav,
    grid,
  })
}

module.exports = invCont