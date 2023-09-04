var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

var addressDAO = require('./addressDAO.js');

const hospitalInsert = async function (hospitalData) {

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

  // Phone
  let sqlPhone = `insert into tbl_phone (phone, id_hospital)
                                          values ('${hospitalData.hospital.phone}', ${hospitalId})`;

  let resultPhone = await prisma.$executeRawUnsafe(sqlPhone);

  // Site
  let sqlSite = `insert into tbl_site (site) values 
                                ('${hospitalData.hospital.donationSite}')`;

  let resultSite = await prisma.$executeRawUnsafe(sqlSite);

  let sqlSiteId = `SELECT LAST_INSERT_ID() AS site_id;`;
  const resultSiteId = await prisma.$queryRawUnsafe(sqlSiteId);

  let siteId = Number(resultSiteId[0].site_id);
  console.log("ID do site inserido:", siteId);

  // OtherSite
  let sqlOtherSite = `insert into tbl_site (site) values 
                                ('${hospitalData.hospital.otherDonationSite}')`;

  let resultOtherSite = await prisma.$executeRawUnsafe(sqlOtherSite);

  let sqlOtherSiteId = `SELECT LAST_INSERT_ID() AS other_site_id;`;
  const resultOtherSiteId = await prisma.$queryRawUnsafe(sqlOtherSiteId);

  let otherSiteId = Number(resultOtherSiteId[0].other_site_id);
  console.log("ID do other site inserido:", otherSiteId);

  // HospitalSite
  let sqlHospitalSite = `insert into tbl_hospital_site (id_hospital, id_site)
                                                        values 
                                                        (${hospitalId}, ${siteId}),
                                                        (${hospitalId}, ${otherSiteId})`;

  let resultHospitalSite = await prisma.$executeRawUnsafe(sqlHospitalSite);

  if (
    resultHospital &&
    resultPhone &&
    resultSite &&
    resultOtherSite &&
    resultHospitalSite
  ) {
    console.log("foi o cadastroooooo");
    return true;
  } else return false;
};

module.exports = {
  hospitalInsert,
};
