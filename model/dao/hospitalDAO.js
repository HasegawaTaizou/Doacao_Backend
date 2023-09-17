var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const addressDAO = require("./addressDAO.js");
const phoneDAO = require("./phoneDAO.js");
const photoDAO = require("./photoDAO.js");
const siteDAO = require("./siteDAO.js");
const hospitalSiteDAO = require("./hospitalSiteDAO.js");

async function insertHospital(hospitalData) {
  try {
    //Address Insert
    let addressInsert = await addressDAO.insertAddress(hospitalData.address);
    let addressId = addressInsert.id;

    //Hospital Insert
    const insertHospitalData = await prisma.hospital.create({
      data: {
        name: hospitalData.hospital.name,
        cnpj: hospitalData.hospital.cnpj,
        email: hospitalData.hospital.email,
        websiteUrl: hospitalData.hospital.website,
        password: hospitalData.hospital.password,
        idAddress: addressId,
      },
    });
    let hospitalId = insertHospitalData.id;

    //Phone Insert
    let phoneInsert = await phoneDAO.insertPhone(
      hospitalData.hospital,
      hospitalId
    );

    //Site Insert
    let insertSite = await siteDAO.insertSite(hospitalData.hospital);

    let donationSiteId = insertSite[0].id;
    let otherDonationSiteId = insertSite[1].id;

    //Hospital Site Insert
    let insertHospitalSite = await hospitalSiteDAO.insertHospitalSite(
      hospitalId,
      donationSiteId,
      otherDonationSiteId
    );

    //Photo Insert
    let insertPhoto = await photoDAO.insertPhoto(
      hospitalData.hospital,
      hospitalId
    );

    return true;
  } catch (error) {
    console.error("Erro ao criar o hospital:", error);
  } finally {
    await prisma.$disconnect();
  }
}

const getHospitalById = async function (hospitalId) {
  console.log(hospitalId);
  let sql = `
  SELECT tbl_hospital.id,
  tbl_hospital.name,
  tbl_hospital.cnpj,
  tbl_hospital.email,
  tbl_phone.phone,
  tbl_hospital.website_url,
  tbl_photo.url,
  tbl_address.cep,
  tbl_address.uf,
  tbl_address.city,
  tbl_address.neighborhood,
  tbl_address.street,
  tbl_address.number,
  tbl_address.complement,
  (
      SELECT site
      FROM tbl_hospital_site
          INNER JOIN tbl_site ON tbl_hospital_site.id_site = tbl_site.id
      WHERE tbl_hospital_site.id_hospital = tbl_hospital.id
      ORDER BY tbl_site.id
      LIMIT 1
  ) AS donationSite,
  (
      SELECT site
      FROM tbl_hospital_site
          INNER JOIN tbl_site ON tbl_hospital_site.id_site = tbl_site.id
      WHERE tbl_hospital_site.id_hospital = tbl_hospital.id
      ORDER BY tbl_site.id
      LIMIT 1 OFFSET 1
  ) AS otherDonationSite
FROM tbl_hospital
  INNER JOIN tbl_phone ON tbl_phone.id_hospital = tbl_hospital.id
  INNER JOIN tbl_photo ON tbl_photo.id_hospital = tbl_hospital.id
  INNER JOIN tbl_address ON tbl_hospital.id_address = tbl_address.id
WHERE tbl_hospital.id = ${hospitalId};
  `;

  console.log(sql);

  let responseHospital = await prisma.$queryRawUnsafe(sql);

  console.log("response hospital: ", responseHospital);

  if (responseHospital) {
    return responseHospital;
  } else {
    return false;
  }
};

// ARRUMAR ESSE AQUI PARA FILTRAR UM WHERE PELO ID
//hospitalId
const getHospitalSchedules = async function () {
  let sql = `
  SELECT 
  tbl_user.id, 
  tbl_user.name, 
  tbl_user.photo_url, 
  tbl_schedule_status.id_schedule,
  DATE_FORMAT(tbl_book_schedule.date, '%d/%m/%Y') AS date,
  TIME_FORMAT(tbl_book_schedule.hour, '%H:%i') AS hour,
  tbl_site.site, 
  tbl_status.status 
  FROM tbl_user
  INNER JOIN tbl_schedule ON tbl_schedule.id_user = tbl_user.id
  INNER JOIN tbl_book_schedule ON tbl_book_schedule.id = tbl_schedule.id_book_schedule
  INNER JOIN tbl_hospital_site ON tbl_hospital_site.id = tbl_book_schedule.id_hospital_site
  INNER JOIN tbl_site ON tbl_site.id = tbl_hospital_site.id_site
  INNER JOIN tbl_schedule_status ON tbl_schedule_status.id_schedule = tbl_schedule.id
  INNER JOIN tbl_status ON tbl_status.id = tbl_schedule_status.id_status;
  `;

  let responseSchedules = await prisma.$queryRawUnsafe(sql);

  if (responseSchedules) {
    return responseSchedules;
  } else {
    return false;
  }
};

async function updateHospital(hospitalId, hospitalData) {
  try {
    const oldHospitalData = await prisma.hospital.findUnique({
      where: {
        id: Number(hospitalId),
      },
      include: {
        Phone: {
          select: {
            phone: true,
          },
        },
        Photo: {
          select: {
            url: true,
          },
        },
        HospitalSite: {
          select: {
            Site: {
              select: {
                site: true,
              },
            },
          },
        },
      },
    });

    console.log(hospitalData.hospital);

    const updatedHospital = await prisma.hospital.update({
      where: {
        id: Number(hospitalId),
      },
      data: {
        // UPDATE HOSPITAL
        name: hospitalData.hospital.name,
        cnpj: hospitalData.hospital.cnpj,
        email: hospitalData.hospital.email,
        websiteUrl: hospitalData.hospital.website,
        // UPDATE PHONE
        Phone: {
          update: {
            where: {
              id: Number(hospitalId),
            },
            data: {
              phone: hospitalData.hospital.phone,
            },
          },
        },
        // UPDATE PHOTO
        Photo: {
          update: {
            where: {
              id: Number(hospitalId),
            },
            data: {
              url: hospitalData.hospital.photo,
            },
          },
        },
        // UPDATE SITE
        HospitalSite: {
          update: {
            where: {
              id: Number(hospitalId),
            },
            data: {
              Site: {
                update: {
                  site: hospitalData.hospital.donationSite,
                  // site: hospitalData.hospital.otherDonationSite,
                },
              },
            },
          },
        },
        // UPDATE ADDRESS
        Address: {
          update: {
            cep: hospitalData.address.cep,
            uf: hospitalData.address.uf,
            city: hospitalData.address.city,
            neighborhood: hospitalData.address.neighborhood,
            street: hospitalData.address.street,
            number: hospitalData.address.number,
            complement: hospitalData.address.complement,
          },
        },
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao atualizar o hospital:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function updateHospitalPassword(hospitalId, hospitalData) {
  try {
    const oldHospitalData = await prisma.hospital.findUnique({
      where: {
        id: Number(hospitalId),
      },
      select: {
        password: true,
      },
    });

    const updatedHospital = await prisma.hospital.update({
      where: {
        id: Number(hospitalId),
      },
      data: {
        password: hospitalData.password,
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao atualizar o hospital password:", error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  insertHospital,
  getHospitalById,
  getHospitalSchedules,
  updateHospital,
  updateHospitalPassword,
};
