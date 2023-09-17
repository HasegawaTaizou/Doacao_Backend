const hospitalDAO = require("../model/dao/hospitalDAO.js");

const message = require("./module/config.js");

const hospitalInsert = async function (hospitalData) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let status = await hospitalDAO.insertHospital(hospitalData);
    if (status) {
      return message.CREATED_ITEM;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

const hospitalGet = async function (hospitalId) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let hospitalData = await hospitalDAO.getHospitalById(hospitalId);

    let jsonHospitalData = {};

    if (hospitalData) {
      jsonHospitalData.status = 200;
      jsonHospitalData.hospital = {
        name: hospitalData[0].name,
        cnpj: hospitalData[0].cnpj,
        email: hospitalData[0].email,
        phone: hospitalData[0].phone,
        website: hospitalData[0].website_url,
        donationSite: hospitalData[0].website_url,
        otherDonationSite: hospitalData[0].website_url,
        photo: hospitalData[0].url,
      };
      jsonHospitalData.address = {
        cep: hospitalData[0].cep,
        uf: hospitalData[0].uf,
        city: hospitalData[0].city,
        neighborhood: hospitalData[0].neighborhood,
        street: hospitalData[0].street,
        complement: hospitalData[0].complement,
      };

      console.log(`Hospital Data: ${hospitalData}`);

      return jsonHospitalData;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

const hospitalGetSchedules = async function () {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let schedulesData = await hospitalDAO.getHospitalSchedules();

    let jsonSchedulesData = {};
    jsonSchedulesData.status = 200;
    jsonSchedulesData.schedules = [];

    for (scheduleData in schedulesData) {
      if (schedulesData) {
        let scheduleObject = {
          user: {
            userId: schedulesData[scheduleData].id,
            name: schedulesData[scheduleData].name,
            photo: schedulesData[scheduleData].photo_url,
          },
          schedule: {
            scheduleId: schedulesData[scheduleData].id_schedule,
            date: schedulesData[scheduleData].date,
            hour: schedulesData[scheduleData].hour,
            site: schedulesData[scheduleData].site,
            status: schedulesData[scheduleData].status,
          },
        };

        jsonSchedulesData.schedules.push(scheduleObject);
      } else {
        return message.ERROR_INTERNAL_SERVER;
      }
    }
    return jsonSchedulesData;
  }
};

module.exports = {
  hospitalInsert,
  hospitalGet,
  hospitalGetSchedules,
};
