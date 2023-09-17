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

const schedulesStatisticsGet = async function (hospitalId) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let schedulesStatisticsData =
      await scheduleDAO.getSchedulesStatisticsByHospitalId(hospitalId);

    let jsonSchedulesStatisticsData = {};

    if (schedulesStatisticsData) {
      console.log(`Schedule Statistics Data: ${schedulesStatisticsData}`);
      jsonSchedulesStatisticsData.status = 200;
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
  }
};

const scheduleCancelUpdate = async function (scheduleId, scheduleData) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let status = await scheduleDAO.updateScheduleCancel(
      scheduleId,
      scheduleData
    );
    if (status) {
      return message.CREATED_ITEM;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

const scheduleConcludeUpdate = async function (scheduleId) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let status = await scheduleDAO.updateScheduleConclude(scheduleId);
    if (status) {
      return message.CREATED_ITEM;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

const scheduleRescheduleUpdate = async function (scheduleId, scheduleData) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let status = await scheduleDAO.updateScheduleReschedule(
      scheduleId,
      scheduleData
    );
    if (status) {
      return message.CREATED_ITEM;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

module.exports = {
  scheduleInsert,
  schedulesStatisticsGet,
  scheduleCancelUpdate,
  scheduleConcludeUpdate,
  scheduleRescheduleUpdate,
};
