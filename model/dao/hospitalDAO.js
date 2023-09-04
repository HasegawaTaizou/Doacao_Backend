var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

var addressDAO = require('./addressDAO.js');
var phoneDAO = require('./phoneDAO.js');
var siteDAO = require('./siteDAO.js');
var hospitalSiteDAO = require('./hospitalSiteDAO.js');

const hospitalInsert = async function (hospitalData) {

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
  let resultPhone = await phoneDAO.phoneInsert(hospitalData.hospital.phone, hospitalId);

  // Site Insert
  let siteId = await siteDAO.siteInsert(hospitalData.hospital.donationSite);

  // OtherSite Insert
  let otherSiteId = await siteDAO.otherSiteInsert(hospitalData.hospital.otherDonationSite);

  // HospitalSite Insert
  let hospitalSite = await hospitalSiteDAO.hospitalSiteInsert(hospitalId, siteId);
  let hospitalOtherSite = await hospitalSiteDAO.hospitalOtherSiteInsert(hospitalId, otherSiteId);

  if (resultHospital && resultPhone) {
    console.log("foi o cadastroooooo");
    return true;
  } else return false;
};

module.exports = {
  hospitalInsert,
};
