var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const getCampaignById = async function (campaignId) {
  const sql = `
    SELECT * FROM tbl_campaign
    WHERE id = ${campaignId};
    `;

  const responseCampaign = await prisma.$queryRawUnsafe(sql);

  if (responseCampaign) {
    return responseCampaign;
  } else {
    return false;
  }
};

const getCampaignsByHospitalId = async function (hospitalId) {
  const sql = `
  SELECT * FROM tbl_campaign
  WHERE id_hospital = ${hospitalId};
      `;

  const responseCampaigns = await prisma.$queryRawUnsafe(sql);

  if (responseCampaigns) {
    return responseCampaigns;
  } else {
    return false;
  }
};

const insertCampaign = async function (campaignData, hospitalId) {
  try {
    const insertCampaignData = await prisma.campaign.create({
      data: {
        date: campaignData.date,
        hour: campaignData.hour,
        description: campaignData.description,
        image: campaignData.image,
        idHospital: hospitalId,
      },
    });

    return insertCampaignData;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

async function updateCampaign(campaignId, campaignData) {
  try {
    const updatedCampaign = await prisma.campaign.update({
      where: {
        id: Number(campaignId),
      },
      data: {
        date: campaignData.date,
        description: campaignData.description,
        image: campaignData.image,
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao atualizar a campanha:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteCampaignById(campaignId) {
  try {
    const deletedCampaign = await prisma.campaign.delete({
      where: {
        id: Number(campaignId),
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao excluir a campanha:", error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  getCampaignById,
  getCampaignsByHospitalId,
  insertCampaign,
  updateCampaign,
  deleteCampaignById,
};
