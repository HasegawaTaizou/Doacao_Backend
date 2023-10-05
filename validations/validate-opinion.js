"use strict";

const validateOpinion = function (opinion) {
  let status = true;

  if (
    opinion == null ||
    opinion == undefined ||
    !isNaN(opinion) ||
    opinion == "" 
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateOpinion,
};
