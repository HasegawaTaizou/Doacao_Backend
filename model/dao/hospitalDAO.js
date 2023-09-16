var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

var addressDAO = require("./addressDAO.js");
var phoneDAO = require("./phoneDAO.js");
var photoDAO = require("./photoDAO.js");
var siteDAO = require("./siteDAO.js");
var hospitalSiteDAO = require("./hospitalSiteDAO.js");

async function insertHospital(hospitalData) {
  try {
    //Address Insert
    let addressInsert = await addressDAO.addressInsert(hospitalData.address);
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
    let phoneInsert = await phoneDAO.phoneInsert(
      hospitalData.hospital,
      hospitalId
    );

    //Site Insert
    let insertSite = await siteDAO.siteInsert(hospitalData.hospital);

    let donationSiteId = insertSite[0].id;
    let otherDonationSiteId = insertSite[1].id;

    //Hospital Site Insert
    let insertHospitalSite = await hospitalSiteDAO.hospitalSiteInsert(
      hospitalId,
      donationSiteId,
      otherDonationSiteId
    );

    //Photo Insert
    let insertPhoto = await photoDAO.photoInsert(
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
  SELECT tbl_hospital.id, tbl_hospital.name, tbl_hospital.cnpj, tbl_hospital.email, tbl_phone.phone, tbl_hospital.website_url, tbl_photo.url, tbl_address.cep, tbl_address.uf, tbl_address.city, tbl_address.neighborhood, tbl_address.street, tbl_address.number, tbl_address.complement FROM tbl_hospital
  INNER JOIN tbl_phone ON tbl_phone.id_hospital = tbl_hospital.id
  INNER JOIN tbl_photo ON tbl_photo.id_hospital = tbl_hospital.id
  INNER JOIN tbl_address ON tbl_hospital.id_address = tbl_address.id
  WHERE tbl_hospital.id = ${hospitalId};
  `;

  console.log(sql);

  let responseHospital = await prisma.$queryRawUnsafe(sql);

  console.log('response hospital: ', responseHospital);

  if (responseHospital) {
    return responseHospital;
  } else {
    return false;
  }
};

module.exports = {
  insertHospital,
  getHospitalById,
};
