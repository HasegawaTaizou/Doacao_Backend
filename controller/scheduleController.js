const scheduleDAO = require("../model/dao/scheduleDAO.js");

const message = require("./module/config.js");

const scheduleInsert = async function (scheduleData) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let status = await scheduleDAO.insertSchedule(scheduleData);
    if (status) {
      return message.CREATED_ITEM;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

module.exports = {
  scheduleInsert,
};
