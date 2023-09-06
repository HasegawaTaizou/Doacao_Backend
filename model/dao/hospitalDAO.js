var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

var addressDAO = require("./addressDAO.js");
var phoneDAO = require("./phoneDAO.js");
var photoDAO = require("./photoDAO.js");
var siteDAO = require("./siteDAO.js");
var hospitalSiteDAO = require("./hospitalSiteDAO.js");

//Insert a hospital
const insertHospital = async function (hospitalData) {
  //Address Insert
  let addressId = await addressDAO.addressInsert(hospitalData.address);

  // Hospital
  let sqlHospital = `insert into tbl_hospital (name,
                                        cnpj,
                                        email,
                                        website_url,
                                        password,
                                        id_address)
                                        values
                                        ('${hospitalData.hospital.name}',
                                        '${hospitalData.hospital.cnpj}',
                                        '${hospitalData.hospital.email}',
                                        '${hospitalData.hospital.website}',
                                        '${hospitalData.hospital.password}',
                                        ${addressId}
                                        )`;

  let resultHospital = await prisma.$executeRawUnsafe(sqlHospital);

  let sqlHospitalId = `SELECT LAST_INSERT_ID() AS hospital_id;`;
  const resultHospitalId = await prisma.$queryRawUnsafe(sqlHospitalId);

  let hospitalId = Number(resultHospitalId[0].hospital_id);
  console.log("ID do hospital inserido:", hospitalId);

  //Phone Insert
  let resultPhone = await phoneDAO.phoneInsert(
    hospitalData.hospital.phone,
    hospitalId
  );

  //Photo Insert
  let resultPhoto = await photoDAO.photoInsert(
    hospitalData.hospital.photo,
    hospitalId
  );

  // Site Insert
  let siteId = await siteDAO.siteInsert(hospitalData.hospital.donationSite);

  // OtherSite Insert
  let otherSiteId = await siteDAO.otherSiteInsert(
    hospitalData.hospital.otherDonationSite
  );

  // HospitalSite Insert
  let hospitalSite = await hospitalSiteDAO.hospitalSiteInsert(
    hospitalId,
    siteId
  );
  let hospitalOtherSite = await hospitalSiteDAO.hospitalOtherSiteInsert(
    hospitalId,
    otherSiteId
  );

  if (resultHospital && resultPhone) {
    console.log("foi o cadastroooooo");
    return true;
  } else return false;
};

const getHospitalById = async function (hospitalId) {

  console.log(hospitalId);
  let sql = `
  SELECT tbl_hospital.id, tbl_hospital.name, tbl_hospital.cnpj, tbl_hospital.email, tbl_phone.phone, tbl_hospital.website_url, tbl_photo.url, tbl_address.cep, tbl_address.uf, tbl_address.city, tbl_address.neighborhood, tbl_address.road, tbl_address.number, tbl_address.complement FROM tbl_hospital
  INNER JOIN tbl_phone ON tbl_phone.id_hospital = tbl_hospital.id
  INNER JOIN tbl_photo ON tbl_photo.id_hospital = tbl_hospital.id
  INNER JOIN tbl_address ON tbl_hospital.id_address = tbl_address.id
  WHERE tbl_hospital.id = ${hospitalId};
  `;

  console.log(sql);

  let responseHospital = await prisma.$queryRawUnsafe(sql);

  console.log('response animal: ', responseHospital);

  if (responseHospital) {
    return responseHospital;
  } else {
    return false;
  }
};

// getAllHospitalDataById

module.exports = {
  insertHospital,
  getHospitalById,
};
