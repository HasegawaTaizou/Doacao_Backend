var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const insertHospitalSite = async function (hospitalId, siteId, otherSiteId) {
  try {
    const insertHospitalSiteData = await prisma.hospitalSite.createMany({
      data: [
        {
          idHospital: hospitalId,
          idSite: siteId,
        },
        {
          idHospital: hospitalId,
          idSite: otherSiteId,
        },
      ],
    });

    return insertHospitalSiteData;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  insertHospitalSite,
};
