var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const addressDAO = require("../dao/addressDAO.js");
const sexDAO = require("../dao/sexDAO.js");
const bloodTypeDAO = require("../dao/bloodTypeDAO.js");

async function insertUser(userData) {
  try {
    //Address Insert
    let addressInsert = await addressDAO.insertAddress(userData.address);
    let addressId = addressInsert.id;

    let sexId = await sexDAO.getSexIdByName(userData.user.sex);

    let bloodTypeId = await bloodTypeDAO.getBloodTypeIdByName(
      userData.user.bloodType
    );

    let [day, month, year] = userData.user.dateOfBirth.split("/");
    let ISOdate = `${year}-${month}-${day}T00:00:00Z`;

    //User Insert
    const insertUserData = await prisma.user.create({
      data: {
        name: userData.user.name,
        cpf: userData.user.cpf,
        dateOfBirth: ISOdate,
        password: userData.user.password,
        weight: userData.user.weight,
        email: userData.user.email,
        phone: userData.user.phone,
        photoUrl: userData.user.photo,
        idAddress: addressId,
        idSex: sexId,
        idBloodType: bloodTypeId,
      },
    });

    console.log(insertUserData);

    return true;
  } catch (error) {
    console.error("Erro ao criar o usuário:", error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  insertUser,
};
