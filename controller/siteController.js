const siteDAO = require("../model/dao/siteDAO.js");

const message = require("./module/config.js");

const getSites = async function (hospitalId) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let hospitalData = await siteDAO.getSitesByHospitalId(hospitalId);

    let jsonHospitalData = {};

    if (hospitalData) {
      console.log(`Hospital Data: ${hospitalData}`);
      jsonHospitalData.status = 200;
      jsonHospitalData.sites = hospitalData;

      return jsonHospitalData;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

module.exports = {
  getSites,
};
