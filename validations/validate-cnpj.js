"use strict";

const validateCNPJ = function (CNPJ) {
  let status = true;

  if (
    CNPJ == null ||
    CNPJ == undefined ||
    !isNaN(CNPJ) ||
    CNPJ == "" ||
    CNPJ.length > 18
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateCNPJ,
};
