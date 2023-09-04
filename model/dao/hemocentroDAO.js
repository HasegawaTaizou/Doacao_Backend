/*********************************************************************
 * Objetivo: Realizar a interação do HEMOCENTRO com o banco de dados
 * DATA: 22/08/2023
 * Autor: Genivania Macedo
 * Versão: 1.0
 ********************************************************************/

//Import da biblioteca do prisma client(responsável por manipular dados no BD)
var { PrismaClient } = require("@prisma/client");

//Instancia da classe do PrismaClient
var prisma = new PrismaClient();

//Inserir novo hemocentro no registro do banco de dados
const insertHemocentro = async function (hospitalData) {
  // Address
  let sqlAddress = `insert into tbl_address (cep, uf, city, neighborhood, road, number, complement)
                                        values (
                                        '${hospitalData.address.cep}',
                                        '${hospitalData.address.state}',
                                        '${hospitalData.address.city}',
                                        '${hospitalData.address.neighborhood}',
                                        '${hospitalData.address.road}',
                                        '${hospitalData.address.number}',
                                        '${hospitalData.address.complement}'
                                        )
                                        `;

  let resultAddress = await prisma.$executeRawUnsafe(sqlAddress);

  let sqlAddressId = `SELECT LAST_INSERT_ID() AS address_id;`;
  const resultAddressId = await prisma.$queryRawUnsafe(sqlAddressId);

  let addressId = Number(resultAddressId[0].address_id);
  console.log("ID do endereço inserido:", addressId);

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
    resultAddress &&
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

//Atualizar dados do HEMOCENTRO no banco de dados
const updateHemocentro = function (dadosHemocentro) {};

module.exports = {
  insertHemocentro,
};
