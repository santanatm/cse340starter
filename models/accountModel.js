const pool = require("../database/");

const accountModel = {};

/* ***************************
 *  Get account data by Id
 * ************************** */
accountModel.getAccountById = async function (account_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.account AS a
          WHERE a.account_id = $1`,
      [account_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getAccountById error: " + error);
  }
};

/* *****************************
 *   Register new account
 * *************************** */
accountModel.registerAccount = async function (
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
};

/* *****************************
 *   Check for existing email
 * *************************** */
accountModel.checkExistingEmail = async function (account_email) {
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1";
      const email = await pool.query(sql, [account_email]);
      return email.rowCount;
    } catch (error) {
      return error.message;
    }
  
};

/* *****************************
 *   Login to account
 * *************************** */
accountModel.loginAccount = async function (
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    // Add your login logic here
  } catch (error) {
    return error.message;
  }
};

/* *****************************
 * Return account data using email address
 * ***************************** */
accountModel.getAccountByEmail = async function (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
};

/* *****************************
 *   Add a new account
 * *************************** */
accountModel.addAccount = async function (
  account_firstname,
  account_lastname,
  account_email,
  account_password,
  account_type
) {
  try {
    const data = await pool.query(
      `INSERT INTO public.account (
          account_firstname,
          account_lastname,
          account_email,
          account_password,
          account_type
        ) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
      [account_firstname, account_lastname, account_email, account_password, account_type]
    );
    return data.rows[0];
  } catch (error) {
    console.error("addAccount error: " + error);
  }
};

/* *****************************
 *   Update an account
 * *************************** */
accountModel.updateAccount = async function (
  account_id,
  account_firstname,
  account_lastname,
  account_email,
  account_password,
  account_type
) {
  try {
    const sql =
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("updateAccount error: " + error);
  }
};

/* *****************************
 *   Update an account password
 * *************************** */
accountModel.updateAccountPassword = async function (
  account_id,
  account_password
) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const data = await pool.query(sql, [
      account_password,
      account_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("updateAccount error: " + error);
  }
};

/* *****************************
 *   Delete an account
 * *************************** */
accountModel.deleteAccount = async function (account_id) {
  try {
    const data = await pool.query(
      `DELETE FROM public.account WHERE account_id = $1 RETURNING *`,
      [account_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("deleteAccount error: " + error);
  }
};

/* ***************************
 * Fetch all accounts
 * ************************** */
accountModel.getAllAccounts = async function () {
  try {
    const query = 'SELECT * FROM public.accounts';
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error fetching all accounts: ' + error);
  }
};

module.exports = accountModel;