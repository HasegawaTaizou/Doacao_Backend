"use strict";

const validatePhone = function (phone) {
  let status = true;

  if (
    phone == null ||
    phone == undefined ||
    !isNaN(phone) ||
    phone == "" ||
    phone.length > 15
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validatePhone,
};
