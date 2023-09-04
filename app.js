const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { request, response } = require('express');

const app = express();

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    app.use(cors())
    next();
});

const bodyJSON = bodyParser.json();


var hospitalController = require('./controller/hospitalController.js');


//ENDPOINTS: 

app.post('/api/v1/hospital-registration', cors(), bodyJSON, async function (request, response) {

    //Recebe os dados encaminhados no body da requisição
    let bodyData = request.body;

    //Envia os dados para a controller
    let resultInsertData = await hospitalController.insertHospital(bodyData);

    //Retorna o status code e a message
    response.status(resultInsertData.status);
    response.json(resultInsertData)

});



app.listen(8080, function () {
    console.log('Servidor aguardando requisições na porta 8080!')
})