const pool = require("../database/")

const invModel = {}

/* ***************************
 *  Get all classification data
 * ************************** */
invModel.getClassifications = async function (){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
invModel.getInventoryByClassificationId = async function (classification_id) {
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
 *  Get single inventory items by inv_id
 * ************************** */
  invModel.getInventoryByInvId = async function (inv_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        WHERE i.inv_id = $1`,
        [inv_id]
      )
      return data.rows
    } catch (error) {
      console.error("getInventoryByInvId error " + error)
    }
  }

  invModel.addClassification = async function (classification_name){
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

  invModel.addVehicle = async function(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
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

  /* ***************************
 *  Update Inventory Data
 * ************************** */
invModel.updateInventory = async function (
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

invModel.deleteInventory = async function (inv_id){
  try {
    const data = await pool.query(
      `delete from public.inventory where inv_id = $1 RETURNING *`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("deleteInventory error: " + error)
  }
}
module.exports = invModel;