const userDAO = require("../model/dao/userDAO.js");

const message = require("./module/config.js");

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
    let userData = await userDAO.getUserById(userId);

    let jsonUserData = {};

    if (userData) {
      let age = Number(userData[0].age);

      console.log(`user Data: ${userData}`);
      jsonUserData.status = 200;
      jsonUserData.user = {
        name: userData[0].name,
        photo: userData[0].photo_url,
        email: userData[0].email,
        phone: userData[0].phone,
        weight: userData[0].weight,
        age: age,
        bloodType: userData[0].type,
        sex: userData[0].sex,
      };

      return jsonUserData;
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

    for (userScheduleData in userSchedulesData) {
      if (userSchedulesData) {
        let userSchedulesObject = {
          scheduleId: userSchedulesData[userScheduleData].id_schedule,
          date: userSchedulesData[userScheduleData].date,
          hour: userSchedulesData[userScheduleData].hour,
          site: userSchedulesData[userScheduleData].site,
          status: userSchedulesData[userScheduleData].status,
        };

        jsonUserSchedulesData.schedules.push(userSchedulesObject);
      } else {
        return message.ERROR_INTERNAL_SERVER;
      }
    }
    return jsonUserSchedulesData;
  }
};

module.exports = {
  userInsert,
  userGet,
  userGetSchedules,
};
