const userDAO = require("../model/dao/userDAO.js");
const { JWT_SECRET } = require("../config.js");
const jwt = require("jsonwebtoken");

const message = require("./module/config.js");

//ADDRESS VALIDATIONS
import { validateCEP } from "../validations/address/validate-cep";
import { validateCity } from "../validations/address/validate-city";
import { validateComplement } from "../validations/address/validate-complement";
import { validateNeighborhood } from "../validations/address/validate-neighborhood";
import { validateNumber } from "../validations/address/validate-number";
import { validateStreet } from "../validations/address/validate-street";
import { validateUF } from "../validations/address/validate-uf";

//USER VALIDATIONS
import { validateId } from "../validations/validate-id";
import { validateName } from "../validations/validate-name";
import { validateCPF } from "../validations/validate-cpf";
import { validateEmail } from "../validations/validate-email";
import { validatePhone } from "../validations/validate-phone";
import { validateDateBirth } from "../validations/validate-date";
import { validateWeight } from "../validations/validate-weight";
import { validatePhoto } from "../validations/validate-photo";
import { validatePassword } from "../validations/validate-password";
import { validateSex } from "../validations/validate-sex";
import { validateBloodType } from "../validations/validate-blood-type";

const loginUser = async function (loginData) {
  if (
    !validateEmail(loginData.email) ||
    !validatePassword(loginData.password)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const userData = await userDAO.userLogin(loginData);

  if (userData == null || userData == undefined) {
    return message.LOGIN_INCORRECT;
  } else if (userData) {
    const jsonUserData = {};

    const token = jwt.sign(
      { userId: userData.id, email: userData.email },
      JWT_SECRET
    );

    jsonUserData.status = message.LOGIN_CORRECT.status;
    jsonUserData.userData = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      photo: userData.photoUrl,
      token: token,
    };

    return jsonUserData;
  } else {
    return message.LOGIN_INCORRECT;
  }
};

const userInsert = async function (userData) {
  if (
    !validateName(userData.user.name) ||
    !validateCPF(userData.user.cpf) ||
    !validateEmail(userData.user.email) ||
    !validatePhone(userData.user.phone) ||
    !validateDateBirth(userData.user.dateOfBirth) ||
    !validateWeight(userData.user.weight) ||
    !validatePhoto(userData.user.photo) ||
    !validatePassword(userData.user.password) ||
    !validateSex(userData.user.sex) ||
    !validateBloodType(userData.user.bloodType) ||
    !validateCEP(userData.address.cep) ||
    !validateUF(userData.address.uf) ||
    !validateCity(userData.address.city) ||
    !validateNeighborhood(userData.address.neighborhood) ||
    !validateStreet(userData.address.street) ||
    !validateNumber(userData.address.number) ||
    !validateComplement(userData.address.complement)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const status = await userDAO.insertUser(userData);
  if (status) {
    return message.CREATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const userGet = async function (userId) {
  if (!validateId(userId)) {
    return message.ERROR_INVALID_ID;
  }

  const userData = await userDAO.getUserById(userId);
  if (userData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (userData) {
    const jsonUserData = {};

    const age = Number(userData[0].age);

    jsonUserData.status = message.OK.status;
    jsonUserData.user = {
      id: userData[0].id,
      name: userData[0].name,
      photo: userData[0].photo_url,
      email: userData[0].email,
      phone: userData[0].phone,
      weight: userData[0].weight,
      age: age,
      bloodType: userData[0].type,
      sex: userData[0].sex,
    };
    jsonUserData.address = {
      cep: userData[0].cep,
      uf: userData[0].uf,
      city: userData[0].city,
      neighborhood: userData[0].neighborhood,
      street: userData[0].street,
      complement: userData[0].complement,
    };

    return jsonUserData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const userEmailGet = async function (userEmail) {
  if (!validateEmail(userEmail.email)) {
    return message.ERROR_REQUIRED_DATA;
  }

  const userData = await userDAO.getUserById(userId);

  if (userData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (userData) {
    const jsonUserData = {};

    jsonUserData.status = message.OK.status;
    jsonUserData.userData = {
      id: userData.id,
      email: userData.email,
      password: userData.password,
    };

    return jsonUserData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const userUpdate = async function (userId, userData) {
  if (!validateId(userId)) {
    return message.ERROR_INVALID_ID;
  } else if (
    !validateName(userData.user.name) ||
    !validateCPF(userData.user.cpf) ||
    !validateEmail(userData.user.email) ||
    !validatePhone(userData.user.phone) ||
    !validateDateBirth(userData.user.dateOfBirth) ||
    !validateWeight(userData.user.weight) ||
    !validatePhoto(userData.user.photo) ||
    !validatePassword(userData.user.password) ||
    !validateSex(userData.user.sex) ||
    !validateBloodType(userData.user.bloodType) ||
    !validateCEP(userData.address.cep) ||
    !validateUF(userData.address.uf) ||
    !validateCity(userData.address.city) ||
    !validateNeighborhood(userData.address.neighborhood) ||
    !validateStreet(userData.address.street) ||
    !validateNumber(userData.address.number) ||
    !validateComplement(userData.address.complement)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const status = await userDAO.updateUser(userId, userData);
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const userGetSchedules = async function (userId) {
  if (!validateId(userId)) {
    return message.ERROR_INVALID_ID;
  }

  const userSchedulesData = await userDAO.getSchedulesUserById(userId);

  if (userSchedulesData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (userSchedulesData) {
    let jsonUserSchedulesData = {};
    jsonUserSchedulesData.status = message.OK.status;
    jsonUserSchedulesData.schedules = [];

    for (userSchedule in userSchedulesData) {
      if (userSchedulesData) {
        let userSchedulesObject = {
          scheduleId: userSchedulesData[userSchedule].id_schedule,
          date: userSchedulesData[userSchedule].date,
          hour: userSchedulesData[userSchedule].hour,
          site: userSchedulesData[userSchedule].site,
          status: userSchedulesData[userSchedule].status,
        };

        jsonUserSchedulesData.schedules.push(userSchedulesObject);
      }
    }
    return jsonUserSchedulesData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const userPasswordUpdate = async function (userId, userData) {
  if (!validateId(userId)) {
    return message.ERROR_INVALID_ID;
  } else if (!validatePassword(userData.password)) {
    return message.ERROR_REQUIRED_DATA;
  }

  const user = await userDAO.getUserById(userId);
  if (user.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  }

  const status = await userDAO.updateUserPassword(userId, userData);
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

module.exports = {
  loginUser,
  userInsert,
  userGet,
  userEmailGet,
  userUpdate,
  userGetSchedules,
  userPasswordUpdate,
};
