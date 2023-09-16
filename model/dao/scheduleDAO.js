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

module.exports = {
  insertSchedule,
};
