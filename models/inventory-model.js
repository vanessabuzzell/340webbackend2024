const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
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
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}
/* ***************************
 *  Get all inventory items for car details page
 * ************************** */
async function buildByCarDetail(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * 
      FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getCarDetail error " + error);
  }
}
/* *****************************
*   Register new clasification
* *************************** */
async function registerNewClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}
 /* **********************
 *   Check for existing Class name
 * ********************* */
 async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification = $1"
    const className = await pool.query(sql, [classification_name])
    return className.rowCount
  } catch (error) {
    return error.message
  }
}
/* *****************************
*   Register new inventory
* *************************** */
async function addNewInventory(
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
  
){
  try {
    const sql = "INSERT INTO inventory ( inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles, 
      inv_color,
      classification_id])
  } catch (error) {
    return error.message
  }
}
 /* **********************
 *   Check for existing inventory
 * ********************* */
 async function checkExistingInventory(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles, 
  inv_color,
  classification_id){
  try {
    const sql = "SELECT * FROM inventory WHERE inv_make = $1 AND inv_model = $2 AND inv_year = $3 AND inv_description = $4 AND inv_image = $5 AND inv_thumbnail = $6 AND inv_price = $7 AND inv_miles = $8 AND inv_color = $9 AND classification_id = $10 "
    const checkVehicleData = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles, 
      inv_color,
      classification_id])
    return checkVehicleData.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  buildByCarDetail,
  registerNewClassification,
  checkExistingClassification,
  addNewInventory,
  checkExistingInventory,
};
