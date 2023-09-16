var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const siteInsert = async function (siteData) {
  try {
    const insertDonationSiteData = await prisma.$transaction([
      prisma.site.create({
        data: {
          site: siteData.donationSite,
        },
      }),
      prisma.site.create({
        data: {
          site: siteData.otherDonationSite,
        },
      }),
    ]);

    return insertDonationSiteData;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  siteInsert,
};
