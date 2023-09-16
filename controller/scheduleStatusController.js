const scheduleStatusDAO = require("../model/dao/scheduleStatusDAO.js");

const message = require("./module/config.js");

const scheduleStatusInsert = async function (scheduleStatusData) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let status = await scheduleStatusDAO.insertScheduleStatus(
      scheduleStatusData
    );
    if (status) {
      return message.CREATED_ITEM;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

module.exports = {
  scheduleStatusInsert,
};
