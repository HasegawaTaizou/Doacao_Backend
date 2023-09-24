var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const addressDAO = require("../dao/addressDAO.js");
const sexDAO = require("../dao/sexDAO.js");
const bloodTypeDAO = require("../dao/bloodTypeDAO.js");

const userLogin = async function (loginData) {
  try {
    //Verify user
    const user = await getUserByEmail(loginData.email);
    console.log(user);
    // Verify password
    const passwordMatch = loginData.password === user.password ? true : false;

    if (passwordMatch) {
      return user;
    }
  } catch (error) {
    return false;
  }
};

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

const getUserById = async function (userId) {
  console.log(userId);
  let sql = `
  SELECT 
  tbl_user.id, 
  tbl_user.name, 
  tbl_user.photo_url,
  tbl_user.email, 
  tbl_user.phone,
  tbl_user.weight,
  TIMESTAMPDIFF(YEAR, tbl_user.date_of_birth, CURDATE()) AS age,
  tbl_blood_type.type,
  tbl_sex.sex,
  tbl_address.cep,
  tbl_address.uf,
  tbl_address.city,
  tbl_address.neighborhood,
  tbl_address.street,
  tbl_address.number,
  tbl_address.complement
  FROM tbl_user
  INNER JOIN tbl_blood_type ON tbl_blood_type.id = tbl_user.id_blood_type
  INNER JOIN tbl_sex ON tbl_sex.id = tbl_user.id_sex
  INNER JOIN tbl_address ON tbl_user.id_address = tbl_address.id
  WHERE tbl_user.id = ${userId};
  `;

  console.log(sql);

  let responseUser = await prisma.$queryRawUnsafe(sql);

  console.log("response user: ", responseUser);

  if (responseUser) {
    return responseUser;
  } else {
    return false;
  }
};

const getUserByEmail = async function (userEmail) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
      select: {
        id: true,
        email: true,
        name: true,
        photoUrl: true,
        password: true,
      },
    });
    console.log(user);
    return user;
  } catch (error) {
    return false;
  }
};

async function updateUser(userId, userData) {
  const [day, month, year] = userData.user.dateOfBirth.split("/");
  const ISOdate = `${year}-${month}-${day}T00:00:00Z`;

  try {
    const bloodTypeId = await bloodTypeDAO.getBloodTypeIdByName(
      userData.user.bloodType
    );
    const sexId = await sexDAO.getSexIdByName(userData.user.sex);

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        // UPDATE HOSPITAL
        name: userData.user.name,
        cpf: userData.user.cpf,
        email: userData.user.email,
        phone: userData.user.phone,
        dateOfBirth: ISOdate,
        weight: userData.user.weight,
        photoUrl: userData.user.photo,
        //UPDATE BLOOD TYPE
        BloodType: {
          connect: {
            id: bloodTypeId,
          },
        },
        //UPDATE SEX
        Sex: {
          connect: {
            id: sexId,
          },
        },
        // UPDATE ADDRESS
        Address: {
          update: {
            cep: userData.address.cep,
            uf: userData.address.uf,
            city: userData.address.city,
            neighborhood: userData.address.neighborhood,
            street: userData.address.street,
            number: userData.address.number,
            complement: userData.address.complement,
          },
        },
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao atualizar o user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

const getSchedulesUserById = async function (userId) {
  console.log(userId);
  let sql = `
  SELECT 
  tbl_schedule_status.id_schedule, 
  DATE_FORMAT(tbl_book_schedule.date, '%d/%m/%Y') AS date,
  TIME_FORMAT(tbl_book_schedule.hour, '%H:%i') AS hour, 
  tbl_status.status, 
  tbl_site.site 
  FROM tbl_schedule_status
  INNER JOIN tbl_schedule ON tbl_schedule.id = tbl_schedule_status.id_schedule
  INNER JOIN tbl_user ON tbl_user.id = tbl_schedule.id_user
  INNER JOIN tbl_book_schedule ON tbl_book_schedule.id = tbl_schedule.id_book_schedule
  INNER JOIN tbl_status ON tbl_status.id = tbl_schedule_status.id_status
  INNER JOIN tbl_hospital_site ON tbl_hospital_site.id = tbl_book_schedule.id_hospital_site
  INNER JOIN tbl_site ON tbl_site.id = tbl_hospital_site.id_site
  WHERE tbl_schedule.id_user = ${userId};
  `;

  console.log(sql);

  let responseUser = await prisma.$queryRawUnsafe(sql);

  console.log("response user: ", responseUser);

  if (responseUser) {
    return responseUser;
  } else {
    return false;
  }
};

async function updateUserPassword(userId, userData) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        password: userData.password,
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao atualizar o user password:", error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  userLogin,
  insertUser,
  getUserById,
  updateUser,
  getUserByEmail,
  getSchedulesUserById,
  updateUserPassword,
};
