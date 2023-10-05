const scheduleDAO = require("../model/dao/scheduleDAO.js");

const message = require("./module/config.js");

//VALIDATIONS
import { validateId } from "../validations/validate-id";
import { validateOpinion } from "../validations/validate-opinion";
import { validateDate } from "../validations/validate-date";
import { validateHour } from "../validations/validate-hour";

const scheduleInsert = async function (scheduleData) {
  if (
    !validateId(scheduleData.idUser) ||
    !validateId(scheduleData.idBookSchedule)
  ) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  }

  const status = await scheduleDAO.insertSchedule(scheduleData);
  if (status) {
    return message.CREATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const schedulesStatisticsGet = async function (hospitalId) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  }
  const schedulesStatisticsData =
    await scheduleDAO.getSchedulesStatisticsByHospitalId(hospitalId);

  if (schedulesStatisticsData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (schedulesStatisticsData) {
    const jsonSchedulesStatisticsData = {};

    jsonSchedulesStatisticsData.status = message.OK.status;
    jsonSchedulesStatisticsData.schedulesStatistics = {
      totalSchedules: Number(schedulesStatisticsData[0].totalSchedules),
      pendingAmount: schedulesStatisticsData[0].pendingAmount,
      scheduledAmount: schedulesStatisticsData[0].scheduledAmount,
      concludedAmount: schedulesStatisticsData[0].concludedAmount,
      rescheduledAmount: schedulesStatisticsData[0].rescheduledAmount,
    };

    return jsonSchedulesStatisticsData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

//VALIDAR SE TEM UM SCHEDULE ANTES
const scheduleCancelUpdate = async function (scheduleId, scheduleData) {
  if (!validateId(scheduleId)) {
    return message.ERROR_INVALID_ID;
  } else if (!validateOpinion(scheduleData.observation)) {
    return message.ERROR_REQUIRED_DATA;
  }

  const status = await scheduleDAO.updateScheduleCancel(
    scheduleId,
    scheduleData
  );
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

//VALIDAR SE TEM UM SCHEDULE ANTES
const scheduleConcludeUpdate = async function (scheduleId) {
  if (!validateId(scheduleId)) {
    return message.ERROR_INVALID_ID;
  }

  const status = await scheduleDAO.updateScheduleConclude(scheduleId);
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

//VALIDAR SE TEM UM SCHEDULE ANTES
const scheduleRescheduleUpdate = async function (scheduleId, scheduleData) {
  if (!validateId(scheduleId)) {
    return message.ERROR_INVALID_ID;
  } else if (
    !validateDate(scheduleData.date) ||
    !validateHour(scheduleData.hour) ||
    !validateId(scheduleData.siteId)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const status = await scheduleDAO.updateScheduleReschedule(
    scheduleId,
    scheduleData
  );
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

module.exports = {
  scheduleInsert,
  schedulesStatisticsGet,
  scheduleCancelUpdate,
  scheduleConcludeUpdate,
  scheduleRescheduleUpdate,
};
