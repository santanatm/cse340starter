const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul id='main-menu' class='d-flex justify-content-space-around list-unstyled'>"
  list += '<li><a class="txt-decoration-none txt-white py-3 px-2 d-block fs-6" href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a class="txt-decoration-none txt-white py-3 px-2 d-block fs-6" href="/inv/type/' +
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
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
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


/* **************************************
* Build the Detail view HTML
* ************************************ */
Util.buildInventoryDetail = async function(data){
  let grid
  if(data.length > 0){
    grid = '<div style="width:100%"><div style="display:flex;flex-wrap:wrap;width:100%;">';
    grid += '<div id="inv-detail" class="col-sm-12 col-md-6">'
    grid += '<img class="img-fluid" src="' + data[0].inv_image+'" alt="Image of '+ data[0].inv_make + ' ' + data[0].inv_model +'" >'
    grid += '</div><div class="col-sm-12 col-md-6 p-2">';
    grid += '<h2 class="mb-4">'+data[0].inv_make+' '+data[0].inv_model+' Details</h2>'
    grid += '<div id="inv-det">'
    grid += '<h3 class="mb-4"><strong>Price: $</strong>'+ new Intl.NumberFormat('en-US').format(data[0].inv_price)+'</h3>'
    grid += '<h3 class="mb-4"><strong>Color: </strong>'+data[0].inv_color+'</h3>'
    grid += '<h3 class="mb-4"><strong>Miles: </strong>'+data[0].inv_miles+'</h3>'
    grid += '</div>'
    grid += '<div id="inv-desc" class="mb-4">'
    grid += '<p ><strong>Description: </strong>'+data[0].inv_description+'</p>'
    grid += '</div></div>'
    grid += '</div></div></div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

 /**************************************
   * Build Single Vehicle Inventory Block
   **************************************/
 Util.buildSingleInventoryBlock = async function(data){
  let block
  vehicle = data[0]
  if (data.length>0){
      block ='<div id="vehicle-layout" class="single-vehicle-view">'
      block += '<div id="details">'
      block += '<section id="reviews" class="vehicle-detail">'
      block += '    <img id="vehicle-image" src="'+ vehicle.inv_image
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors">'
      block += '</section>'
      block += '<section id="reviews" class="vehicle-detail">'
      block += '        <h2>'+vehicle.inv_make+' '+vehicle.inv_model+' Details</h2>  '
      block += '        <p><b>Price: </b>$' +new Intl.NumberFormat('en-US').format(vehicle.inv_price)+ '</p>'
      block += '        <p><b>Milage: </b>' +new Intl.NumberFormat('en-US').format(vehicle.inv_miles)+ '</p>'
      block += '        <p><b>Description: </b>' +vehicle.inv_description+ '</p>'
      block += '</section>'

      block+='</div>'
  } else {
    block += '<p class="notice">Sorry, we were unable to find this vehicle in our inventory.</p>'
  }
  return block
};

Util.buildClassificationSelect = async function(selected_id = ""){
  let block;
  let data = await invModel.getClassifications()
  if (data.rowCount > 0){
    block =  '<select id="classificationList" name="classification_id">';
    block += '<option value="">Choose a Classification</option>'
    data.rows.forEach((row) => {
      selected = (row.classification_id == selected_id)?"selected":""
      block += '<option value="'+row.classification_id+'" '+selected+'>'
      block += row.classification_name
      block += '</option>'
    })
    block += '</select>';
  }else{
    block = '<p class="notice">Sorry, we are unable to retrieve a list of classifications at this time, please check the connection to the database.</p>'
  }
  return block;
};

Util.makeItBorkened = async function(){
  throw new Error('divide by zero!'); 
  return 1 / 0;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util