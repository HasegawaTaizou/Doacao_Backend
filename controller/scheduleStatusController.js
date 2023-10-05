const scheduleStatusDAO = require("../model/dao/scheduleStatusDAO.js");

//VALIDATIONS
import { validateOpinion } from "../validations/validate-opinion.js";
import { validateId } from "../validations/validate-id.js";

const message = require("./module/config.js");

const scheduleStatusInsert = async function (scheduleStatusData) {
  if (
    !validateOpinion(scheduleStatusData.observation) ||
    !validateId(scheduleStatusData.idStatus) ||
    !validateId(scheduleStatusData.idSchedule)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const status = await scheduleStatusDAO.insertScheduleStatus(scheduleStatusData);
  if (status) {
    return message.CREATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

module.exports = {
  scheduleStatusInsert,
};
