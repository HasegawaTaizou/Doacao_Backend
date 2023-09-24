const userDAO = require("../model/dao/userDAO.js");
const { JWT_SECRET } = require("../config.js");
const jwt = require("jsonwebtoken");

const message = require("./module/config.js");

const loginUser = async function (loginData) {
  const jsonUserData = {};

  const userData = await userDAO.userLogin(loginData);

  if (userData) {
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
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let status = await userDAO.insertUser(userData);
    if (status) {
      return message.CREATED_ITEM;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

const userGet = async function (userId) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    const userData = await userDAO.getUserById(userId);

    const jsonUserData = {};

    if (userData) {
      const age = Number(userData[0].age);

      console.log(`user Data: ${userData}`);
      jsonUserData.status = 200;
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
  }
};

const userEmailGet = async function (userEmail) {
  const jsonUserData = {};

  const userData = await userDAO.getUserByEmail(userEmail.email);

  if (userData) {
    jsonUserData.status = message.LOGIN_CORRECT.status;
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
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let status = await userDAO.updateUser(userId, userData);
    if (status) {
      return message.CREATED_ITEM;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

const userGetSchedules = async function (userId) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let userSchedulesData = await userDAO.getSchedulesUserById(userId);

    let jsonUserSchedulesData = {};
    jsonUserSchedulesData.status = 200;
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
      } else {
        return message.ERROR_INTERNAL_SERVER;
      }
    }
    return jsonUserSchedulesData;
  }
};

const userPasswordUpdate = async function (userId, userData) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let status = await userDAO.updateUserPassword(userId, userData);
    if (status) {
      return message.CREATED_ITEM;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
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
