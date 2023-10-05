const bookScheduleDAO = require("../model/dao/bookScheduleDAO.js");

const message = require("./module/config.js");

//VALIDATIONS
import { validateId } from "../validations/validate-id.js";
import { validateDate } from "../validations/validate-date.js";
import { validateHour } from "../validations/validate-hour.js";

const bookScheduleInsert = async function (bookScheduleData) {
  bookScheduleData.forEach((bookSchedule) => {
    if (
      !validateId(bookSchedule.hospitalSiteId) ||
      !validateDate(bookSchedule.date) ||
      !validateHour(bookSchedule.hour)
    ) {
      return message.ERROR_REQUIRED_DATA;
    }
  });

  const status = await bookScheduleDAO.insertBookSchedule(bookScheduleData);
  if (status) {
    return message.CREATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const bookSchedulesGet = async function (hospitalId) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  }

  const bookSchedulesData = await bookScheduleDAO.getBookSchedulesByHospitalId(
    hospitalId
  );

  if (bookSchedulesData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (bookSchedulesData) {
    const jsonBookSchedulesData = {};

    jsonBookSchedulesData.status = message.OK.status;
    jsonBookSchedulesData.bookSchedules = bookSchedulesData;

    return jsonBookSchedulesData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

//FAZER VALIDAÇÃO DE FAZER UPDATE EM UM BOOK SCHEDULE QUE NAO EXISTE
const bookScheduleUpdate = async function (bookScheduleId, bookScheduleData) {
  if (!validateId(bookScheduleId)) {
    return message.ERROR_INVALID_ID;
  } else if (
    !validateDate(bookScheduleData.date) ||
    !validateHour(bookScheduleData.hour) ||
    !validateId(bookScheduleData.siteId)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const status = await bookScheduleDAO.updateBookSchedule(
    bookScheduleId,
    bookScheduleData
  );
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

//FAZER VALIDAÇÃO DE FAZER DELETE EM UM BOOK SCHEDULE QUE NAO EXISTE
const bookScheduleDelete = async function (bookScheduleId) {
  if (!validateId(bookScheduleId)) {
    return message.ERROR_INVALID_ID;
  } else {
    const status = await bookScheduleDAO.deleteBookSchedule(bookScheduleId);
    if (status) {
      return message.NO_CONTENT;
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
