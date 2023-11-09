"use strict";

const validateOpinion = function (opinion) {
  let status = true;

  console.log(opinion);
  if (
    opinion == null ||
    opinion == undefined ||
    typeof opinion !== 'string' 
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateOpinion,
};
