"use strict";

const validateCEP = function (CEP) {
  let status = true;

  if (
    CEP == null ||
    CEP == undefined ||
    !isNaN(CEP) ||
    CEP == "" ||
    CEP.length > 9
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateCEP,
};
