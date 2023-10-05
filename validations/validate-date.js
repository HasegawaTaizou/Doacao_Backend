"use strict";

const validateDate = function (date) {
  let status = true;

  if (date == null || date == undefined || !isNaN(date) || date == "") {
    status = false;
  }
  return status;
};

module.exports = {
  validateDate,
};
