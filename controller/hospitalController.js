var hospitalDAO = require("../model/dao/hospitalDAO.js");

const hospitalInsert = async function (hospitalData) {
  //Import do arquivo global de configurações do projeto
  let message = require("./module/config.js");

  if (
    // dadosHemocentro.nome  == ''  || dadosHemocentro.nome  == undefined || dadosHemocentro.nome.length > 100 ||
    // dadosHemocentro.cnpj  == ''  || dadosHemocentro.cnpj  == undefined || dadosHemocentro.cnpj.length > 18 ||
    // dadosHemocentro.email == ''  || dadosHemocentro.email == undefined ||
    // dadosHemocentro.phone == ''  || dadosHemocentro.phone == undefined || dadosHemocentro.phone.length > 15 ||
    // dadosHemocentro.photo == ''  || dadosHemocentro.photo == undefined
    false
  ) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let status = await hospitalDAO.insertHospital(hospitalData);
    console.log(`statusss: `, status);
    if (status) return message.CREATED_ITEM;
    else return message.ERROR_INTERNAL_SERVER;
  }
};

const hospitalGet = async function (hospitalId) {
  //Import do arquivo global de configurações do projeto
  let message = require("./module/config.js");

  if (
    // dadosHemocentro.nome  == ''  || dadosHemocentro.nome  == undefined || dadosHemocentro.nome.length > 100 ||
    // dadosHemocentro.cnpj  == ''  || dadosHemocentro.cnpj  == undefined || dadosHemocentro.cnpj.length > 18 ||
    // dadosHemocentro.email == ''  || dadosHemocentro.email == undefined ||
    // dadosHemocentro.phone == ''  || dadosHemocentro.phone == undefined || dadosHemocentro.phone.length > 15 ||
    // dadosHemocentro.photo == ''  || dadosHemocentro.photo == undefined
    false
  ) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let hospitalData = await hospitalDAO.getHospitalById(hospitalId);

    let jsonHospitalData = {};

    console.log(`hospitalId: `, hospitalId);
    
    if (hospitalData) {
      jsonHospitalData.status = 200;
      jsonHospitalData.hospitalData = hospitalData;

      console.log(`hospitalData: `, jsonHospitalData);

      return jsonHospitalData;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

module.exports = {
  hospitalInsert,
  hospitalGet,
};
