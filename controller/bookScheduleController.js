const bookScheduleDAO = require("../model/dao/bookScheduleDAO.js");

const message = require("./module/config.js");

const bookScheduleInsert = async function (bookScheduleData) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let status = await bookScheduleDAO.insertBookSchedule(bookScheduleData);
    if (status) {
      return message.CREATED_ITEM;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

const bookSchedulesGet = async function (hospitalId) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let bookSchedulesData = await bookScheduleDAO.getBookSchedulesByHospitalId(
      hospitalId
    );

    let jsonBookSchedulesData = {};

    if (bookSchedulesData) {
      console.log(`Book Schedule Data: ${bookSchedulesData}`);
      jsonBookSchedulesData.status = 200;
      jsonBookSchedulesData.bookSchedules = bookSchedulesData;

      return jsonBookSchedulesData;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

const bookScheduleUpdate = async function (bookScheduleId, bookScheduleData) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let status = await bookScheduleDAO.updateBookSchedule(
      bookScheduleId,
      bookScheduleData
    );
    if (status) {
      return message.CREATED_ITEM;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

const bookScheduleDelete = async function (bookScheduleId) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let status = await bookScheduleDAO.deleteBookSchedule(bookScheduleId);
    if (status) {
      return message.CREATED_ITEM;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

module.exports = {
  bookScheduleInsert,
  bookSchedulesGet,
  bookScheduleUpdate,
  bookScheduleDelete,
};
