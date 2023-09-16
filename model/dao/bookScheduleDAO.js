var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const bookScheduleInsert = async function (bookScheduleData) {
  try {
    const insertBookScheduleData = await prisma.phone.create({
      data: {
        phone: phoneData.phone,
        idHospital: hospitalId,
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
  bookScheduleInsert,
};
