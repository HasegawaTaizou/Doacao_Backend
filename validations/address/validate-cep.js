"use strict";

const validateCEP = function (CEP) {
  let status = true;

  if (
    CEP == null ||
    CEP == undefined ||
    isNaN(CEP.replace(/[\-\s]/g, '')) ||
    CEP == "" ||
    CEP.length > 8
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateCEP,
};
