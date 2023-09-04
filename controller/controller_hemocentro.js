/*********************************************************************
 * Objetivo: Implementar a regra de negócio entre o APP e a MODEL
 * DATA: 22/08/2023
 * Autor: Genivania Macedo
 * Versão: 1.0
 ********************************************************************/

var hemocentroDAO = require('../model/dao/hemocentroDAO.js');

const inserirHemocentro = async function(dadosHemocentro){

    //Import do arquivo global de configurações do projeto
    let message = require('./modulo/config.js')

    if( 
        // dadosHemocentro.nome  == ''  || dadosHemocentro.nome  == undefined || dadosHemocentro.nome.length > 100 ||
        // dadosHemocentro.cnpj  == ''  || dadosHemocentro.cnpj  == undefined || dadosHemocentro.cnpj.length > 18 ||
        // dadosHemocentro.email == ''  || dadosHemocentro.email == undefined ||
        // dadosHemocentro.phone == ''  || dadosHemocentro.phone == undefined || dadosHemocentro.phone.length > 15 ||
        // dadosHemocentro.photo == ''  || dadosHemocentro.photo == undefined 
        false
    ){
        return message.ERROR_REQUIRED_DATA;
    }else{
        let status = await hemocentroDAO.insertHemocentro(dadosHemocentro);
        console.log(`statusss: `, status);
        if (status)
            return message.CREATED_ITEM;
        else
            return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    inserirHemocentro
}