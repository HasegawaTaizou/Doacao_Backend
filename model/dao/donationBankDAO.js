var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const getDonationBanksByHospitalId = async function (hospitalId) {
  const sql = `
  SELECT * FROM tbl_donation_bank
  WHERE id_hospital = ${hospitalId};
      `;

  const responseDonationBanks = await prisma.$queryRawUnsafe(sql);

  if (responseDonationBanks) {
    return responseDonationBanks;
  } else {
    return false;
  }
};

const insertDonationBank = async function (
  donationBankData,
  bloodTypeId,
  hospitalId
) {
  try {
    const insertDonationBankData = await prisma.donationBank.create({
      data: {
        year: donationBankData.year,
        bloodMl: donationBankData.bloodMl,
        idHospital: hospitalId,
        idBloodType: bloodTypeId,
      },
    });

    return insertDonationBankData;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

async function updateDonationBank(donationBankId, donationBankData) {
  try {
    const updatedDonationBank = await prisma.donationBank.update({
      where: {
        id: Number(donationBankId),
      },
      data: {
        bloodMl: donationBankData.bloodMl,
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao atualizar o donation bank:", error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  getDonationBanksByHospitalId,
  insertDonationBank,
  updateDonationBank,
};