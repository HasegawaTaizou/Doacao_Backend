const userDAO = require("../model/dao/userDAO.js");

const message = require("./module/config.js");

const userInsert = async function (userData) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let status = await userDAO.insertUser(userData);
    if (status) {
      return message.CREATED_ITEM;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

module.exports = {
  userInsert,
};
