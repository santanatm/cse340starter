const utilities = require(".")
const accountModel = require("../models/accountModel")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.addClassificationRules = ()=>{
 return [
  // classification name is required and must be string
  body("classification_name")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Please provide a classification name."), // on error this message is sent.
 ]
}

validate.checkAddClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
}

validate.addVehicleRules = ()=>{
    return [
      //classification_id, 
      body("classification_id")
      .isInt({min:1})
      .withMessage("Please select a valid classification."),
      //inv_make, 
      body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the make of the vehicle."),
      //inv_model, 
      body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the model of the vehicle."),
      //inv_year, 
      body("inv_year")
      .isInt({min:1900, max:2025})//(new Date).getFullYear +1})
      .withMessage("Please provide a four digit year."),
      //inv_description, 
      body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a description of the vehicle"),
      //inv_image, 
      //inv_thumbnail, 
      //inv_price, 
      body("inv_price")
      .isInt({min:1})
      .withMessage("Please provide a valid price for the vehicle."),
      //inv_miles, 
      body("inv_miles")
      .isInt({min:1})
      .withMessage("Please provide the milage from the vehicle's odometer"),
      //inv_color 
      body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the color of the vehicle."),
    ]
}
validate.checkAddVehicleData = async (req, res, next) => {
    const {  inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const classificationSelect = await utilities.buildClassificationSelect();
      res.render("./inventory/add-vehicle", {
        errors,
        title: "Add Vehicle",
        nav,
        classificationSelect,
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
      return
    }
    next()
}


validate.checkUpdateVehicleData = async (req, res, next) => {
  const {  inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationSelect(classification_id);
    res.render("./inventory/edit-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationSelect,
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color,
      classification_id,
      inv_id
    })
    return
  }
  next()
}

validate.deleteVehicleRules= ()=>{
  return [

  ]}
validate.checkDeleteVehicleData,

module.exports = validate