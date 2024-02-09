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
    errors: null,
    grid,
  })
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  const block = await utilities.buildSingleInventoryBlock(data)
  let nav = await utilities.getNav()
  const className = data[0].inv_year +" "+ data[0].inv_make +" "+ data[0].inv_model
  res.render("./inventory/vehicle", {
    title: className,
    nav,
    errors: null,
    block,
  })
}

invCont.buildManagement = async function (req, res, next){
  let nav = await utilities.getNav()

  const classificationSelect = await utilities.buildClassificationSelect()

  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect

  })

}
invCont.buildAddVehicle = async function (req, res, next){
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationSelect();
  
  res.render("./inventory/add-vehicle", {
    title: "Add Vehicle",
    nav,
    errors: null,
    classificationSelect
  })
}

invCont.buildAddClassification = async function (req, res, next){
  let nav = await utilities.getNav()

  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}
/*** Add Classification */
invCont.addClassification = async function(req, res, next){
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const invResult = await invModel.addClassification(
    classification_name
  )
if (invResult) {
  req.flash(
    "notice",
    `Classification Added Successfully.`
  )
  let nav = await utilities.getNav()
  res.status(201).render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
} else {
  req.flash("notice", "Sorry, adding the Classification failed.")
  res.status(501).render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}
}
/*** Add Vehicle */
invCont.addVehicle = async function(req, res, next){
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationSelect();
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const invResult = await invModel.addVehicle(
    
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
  )
if (invResult) {
  req.flash(
    "notice",
    `Vehicle Added Successfully.`
  )
  res.render("./inventory/add-vehicle", {
    title: "Add Vehicle",
    nav,
    errors: null,
    classificationSelect
  })
} else {
  
  req.flash("notice", "Sorry, adding the Vehicle failed.")
  res.render("./inventory/add-vehicle", {
    title: "Add Vehicle",
    nav,
    errors: null,
    classificationSelect
  })
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

/***************************** */
/*** Build Edit Inventory View */
/***************************** */
invCont.buildEditInventory = async function(req, res, next){
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const data = await invModel.getInventoryByInvId(inv_id)
  const itemData = data[0]
  const itemName = itemData.inv_make + " " + itemData.inv_model
  const classificationSelect = await utilities.buildClassificationSelect(itemData.classification_id);
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
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
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationSelect(classification_id)
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
}

invCont.buildDeleteInventory = async function(req, res, next){
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const data = await invModel.getInventoryByInvId(inv_id)
  const itemData = data[0]
  const itemName = itemData.inv_make + " " + itemData.inv_model
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

invCont.deleteInventory = async function(req, res, next){
  const {
    inv_id,
  } = req.body
  let nav = await utilities.getNav()
  const data = await invModel.getInventoryByInvId(inv_id)
  const itemData = data[0]
  const itemName = itemData.inv_make + " " + itemData.inv_model
  const deleteResult = await invModel.deleteInventory(
    inv_id,  
  )
  if (deleteResult) {
    req.flash("notice", `The ${itemName} was successfully delted.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    })
  }
}

module.exports = invCont