var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const statusDAO = require("../dao/statusDAO");

const insertSchedule = async function (scheduleData) {
  console.log(scheduleData);
  try {
    const insertScheduleData = await prisma.schedule.create({
      data: {
        idUser: scheduleData.idUser,
        idBookSchedule: scheduleData.idBookSchedule,
      },
    });

    return insertScheduleData;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

const getScheduleByHospitalId = async function (hospitalId) {
  const sql = `
  SELECT * FROM tbl_schedule WHERE id = ${hospitalId};
  `;

  const responseSchedule = await prisma.$queryRawUnsafe(sql);

  if (responseSchedule) {
    return responseSchedule;
  } else {
    return false;
  }
};

const getSchedulesStatisticsByHospitalId = async function (hospitalId) {
  let sql = `
  SELECT
  COUNT(tbl_schedule_status.id_schedule) AS totalSchedules,
  SUM(CASE WHEN tbl_status.status = "PENDING" THEN 1 ELSE 0 END) AS pendingAmount,
  SUM(CASE WHEN tbl_status.status = "SCHEDULED" THEN 1 ELSE 0 END) AS scheduledAmount,
  SUM(CASE WHEN tbl_status.status = "CONCLUDED" THEN 1 ELSE 0 END) AS concludedAmount,
  SUM(CASE WHEN tbl_status.status = "RESCHEDULED" THEN 1 ELSE 0 END) AS rescheduledAmount
  FROM tbl_hospital
  LEFT JOIN tbl_hospital_site ON tbl_hospital.id = tbl_hospital_site.id_hospital
  LEFT JOIN tbl_book_schedule ON tbl_hospital_site.id = tbl_book_schedule.id_hospital_site
  LEFT JOIN tbl_schedule ON tbl_book_schedule.id = tbl_schedule.id_book_schedule
  LEFT JOIN tbl_user ON tbl_schedule.id_user = tbl_user.id
  LEFT JOIN tbl_schedule_status ON tbl_schedule.id = tbl_schedule_status.id_schedule
  LEFT JOIN tbl_status ON tbl_schedule_status.id_status = tbl_status.id
  WHERE tbl_hospital.id = ${hospitalId};
  `;

  console.log(sql);

  let responseSchedulesStatistics = await prisma.$queryRawUnsafe(sql);

  console.log("response schedules statistics: ", responseSchedulesStatistics);

  if (responseSchedulesStatistics) {
    return responseSchedulesStatistics;
  } else {
    return false;
  }
};

async function updateScheduleCancel(scheduleId, scheduleData) {
  const statusId = await statusDAO.getStatusIdByName("PENDING");

  const sql = `
  UPDATE tbl_schedule_status
  SET 
  id_status = ${statusId},
  observation = "${scheduleData.observation}"
  WHERE id_schedule = ${scheduleId};
  `;

  const updateSchedule = await prisma.$queryRawUnsafe(sql);

  console.log("update schedule cancel: ", updateSchedule);

  if (updateSchedule) {
    return updateSchedule;
  } else {
    return false;
  }
}

async function updateScheduleConclude(scheduleId) {
  const statusId = await statusDAO.getStatusIdByName("CONCLUDED");

  const sql = `
  UPDATE tbl_schedule_status
  SET 
  id_status = ${statusId}
  WHERE id_schedule = ${scheduleId};
  `;

  const updateSchedule = await prisma.$queryRawUnsafe(sql);

  console.log("update schedule conclude: ", updateSchedule);

  if (updateSchedule) {
    return updateSchedule;
  } else {
    return false;
  }
}

async function updateScheduleReschedule(scheduleId, scheduleData) {
  const statusId = await statusDAO.getStatusIdByName("RESCHEDULE");

  const sql = `
  UPDATE tbl_schedule_status
  SET 
  id_status = ${statusId}
  WHERE id_schedule = ${scheduleId};
  `;

  const updateSchedule = await prisma.$queryRawUnsafe(sql);

  console.log("update schedule conclude: ", updateSchedule);

  if (updateSchedule) {
    return updateSchedule;
  } else {
    return false;
  }
}

async function getSchedules() {
  let sql = `
  SELECT * from tbl_schedule;
  `;

  console.log(sql);

  let responseSchedules = await prisma.$queryRawUnsafe(sql);

  console.log("response schedules statistics: ", responseSchedules);

  if (responseSchedules) {
    return responseSchedules;
  } else {
    return false;
  }
}

module.exports = {
  insertSchedule,
  getScheduleByHospitalId,
  getSchedulesStatisticsByHospitalId,
  updateScheduleCancel,
  updateScheduleConclude,
  updateScheduleReschedule,
  getSchedules,
};
