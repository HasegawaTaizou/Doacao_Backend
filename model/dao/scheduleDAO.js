var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

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
  try {
    const oldscheduleData = await prisma.schedule.findUnique({
      where: {
        id: Number(scheduleId),
      },
      include: {
        ScheduleStatus: {
          select: {
            observation: true,
            Status: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    console.log(oldscheduleData.ScheduleStatus);

    const updatedSchedule = await prisma.schedule.update({
      where: {
        id: Number(scheduleId),
      },
      data: {
        ScheduleStatus: {
          update: {
            where: {
              id: Number(scheduleId),
            },
            data: {
              observation: scheduleData.observation,
              Status: {
                update: {
                  status: "PENDING",
                },
              },
            },
          },
        },
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao atualizar o schedule:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function updateScheduleConclude(scheduleId) {
  try {
    const oldscheduleData = await prisma.schedule.findUnique({
      where: {
        id: Number(scheduleId),
      },
      include: {
        ScheduleStatus: {
          select: {
            observation: true,
            Status: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    console.log(oldscheduleData.ScheduleStatus);

    const updatedSchedule = await prisma.schedule.update({
      where: {
        id: Number(scheduleId),
      },
      data: {
        ScheduleStatus: {
          update: {
            where: {
              id: Number(scheduleId),
            },
            data: {
              Status: {
                update: {
                  status: "CONCLUDED",
                },
              },
            },
          },
        },
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao atualizar o schedule:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function updateScheduleReschedule(scheduleId, scheduleData) {
  try {
    const oldscheduleData = await prisma.schedule.findUnique({
      where: {
        id: Number(scheduleId),
      },
      include: {
        ScheduleStatus: {
          select: {
            Status: {
              select: {
                status: true,
              },
            },
          },
        },
        BookSchedule: {
          select: {
            date: true,
            hour: true,
            HospitalSite: {
              select: {
                idSite: true,
              },
            },
          },
        },
      },
    });

    console.log(oldscheduleData);

    let [day, month, year] = scheduleData.date.split("/");
    let ISOdate = `${year}-${month}-${day}T00:00:00Z`;

    let [hour, minute] = scheduleData.hour.split(":");
    let ISOhour = `1970-01-01T${hour}:${minute}:00Z`;

    const updatedSchedule = await prisma.schedule.update({
      where: {
        id: Number(scheduleId),
      },
      data: {
        ScheduleStatus: {
          update: {
            where: {
              id: Number(scheduleId),
            },
            data: {
              Status: {
                update: {
                  status: "RESCHEDULED",
                },
              },
            },
          },
        },
        BookSchedule: {
          update: {
            date: ISOdate,
            hour: ISOhour,
            HospitalSite: {
              update: {
                idSite: scheduleData.siteId,
              },
            },
          },
        },
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao atualizar o schedule:", error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  insertSchedule,
  getSchedulesStatisticsByHospitalId,
  updateScheduleCancel,
  updateScheduleConclude,
  updateScheduleReschedule,
};
