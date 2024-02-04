const pool = require("../database/")
const invModel = require("../models/inventory-model")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


/* ***************************
 *  Get all inventory by InventoryId
 * ************************** */
async function getInventoryById(invId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       WHERE i.inv_id = $1`,
      [invId]
    )
    return data.rows
  } catch (error) {
    console.error("inv_id error " + error)
  }
}

async function addClassification(classification_name){
  try {
    const data = await pool.query(
      `Insert into classification (classification_name) 
      values ($1)`,
      [classification_name]
    )
    return data.rows
  } catch (error) {
    console.error("addClassification error: " + error)
  }
}

async function addVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try {
    const data = await pool.query(
      `INSERT INTO public.inventory (
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
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("addVehicle error: " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, addVehicle};
