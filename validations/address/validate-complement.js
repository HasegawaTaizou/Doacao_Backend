"use strict";

const validateComplement = function (complement) {
  let status = true;

  if (
    complement == null ||
    complement == undefined ||
    !isNaN(complement) ||
    complement.length > 200
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateComplement,
};
