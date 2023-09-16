var bookScheduleDAO = require("../model/dao/bookScheduleDAO.js");

let message = require("./module/config.js");

const bookScheduleInsert = async function (bookScheduleData) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let status = await bookScheduleDAO.bookScheduleInsert(bookScheduleData);
    if (status) {
      return message.CREATED_ITEM;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

module.exports = {
  bookScheduleInsert,
};
