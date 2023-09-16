var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const insertBookSchedule = async function (bookScheduleData) {
  try {
    const insertBookScheduleData = await prisma.bookSchedule.create({
      data: {
        date: bookScheduleData.date,
        hour: bookScheduleData.hour,
      },
    });

    return insertBookScheduleData;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  insertBookSchedule
};
