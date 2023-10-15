"use strict";

const validateNumber = function (number) {
  let status = true;

  if (
    number == null ||
    number == undefined ||
    isNaN(number) ||
    number == "" ||
    number.length > 4
  ) {
    console.log('isNAN: ', isNaN(number));
    status = false;
  }
  return status;
};

module.exports = {
  validateNumber,
};
