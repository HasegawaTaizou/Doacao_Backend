"use strict";

const validateHour = function (hour) {
  let status = true;

  if (hour == null || hour == undefined || !isNaN(hour) || hour == "") {
    status = false;
  }
  return status;
};

module.exports = {
  validateHour,
};
