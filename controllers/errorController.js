const errorCont = {}

errorCont.borkenIt = async function (req, res, next) {
  const value = await utilities.makeItBorkened;
}

module.exports = errorCont