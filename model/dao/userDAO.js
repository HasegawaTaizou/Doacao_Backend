var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const addressDAO = require('../dao/addressDAO.js')

async function insertHospital(hospitalData) {
  try {
    //Address Insert
    let addressInsert = await addressDAO.insertAddress(hospitalData.address);
    let addressId = addressInsert.id;

    //User Insert
    const insertUserData = await prisma.user.create({
      data: {
        name: hospitalData.hospital.name,
        cnpj: hospitalData.hospital.cnpj,
        email: hospitalData.hospital.email,
        websiteUrl: hospitalData.hospital.website,
        password: hospitalData.hospital.password,
        idAddress: addressId,
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao criar o usuário:", error);
  } finally {
    await prisma.$disconnect();
  }
}
