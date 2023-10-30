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
  SELECT 
  id,
  DATE_FORMAT(date, '%d/%m/%Y') AS date,
  TIME_FORMAT(hour, '%H:%i') AS hour,
  description,
  image
  FROM tbl_campaign
  WHERE id_hospital = ${hospitalId};
  `;

  const responseCampaigns = await prisma.$queryRawUnsafe(sql);

  if (responseCampaigns) {
    return responseCampaigns;
  } else {
    return false;
  }
};

const insertCampaign = async function (campaignData) {
  try {
    const [day, month, year] = campaignData.date.split("/");
    const ISOdate = `${year}-${month}-${day}T00:00:00Z`;

    const [hour, minute] = campaignData.hour.split(":");
    const ISOhour = `1970-01-01T${hour}:${minute}:00Z`;

    const insertCampaignData = await prisma.campaign.create({
      data: {
        date: ISOdate,
        hour: ISOhour,
        description: campaignData.description,
        image: campaignData.image,
        idHospital: campaignData.hospitalId,
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
    const [day, month, year] = campaignData.date.split("/");
    const ISOdate = `${year}-${month}-${day}T00:00:00Z`;

    const [hour, minute] = campaignData.hour.split(":");
    const ISOhour = `1970-01-01T${hour}:${minute}:00Z`;

    const updatedCampaign = await prisma.campaign.update({
      where: {
        id: Number(campaignId),
      },
      data: {
        date: ISOdate,
        hour: ISOhour,
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
