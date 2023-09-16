var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const insertScheduleStatus = async function (scheduleStatusData) {
  console.log(scheduleStatusData);
  try {
    const insertScheduleStatusData = await prisma.scheduleStatus.create({
      data: {
        observation: scheduleStatusData.observation,
        idStatus: scheduleStatusData.idStatus,
        idSchedule: scheduleStatusData.idSchedule,
      },
    });

    return insertScheduleStatusData;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  insertScheduleStatus,
};
