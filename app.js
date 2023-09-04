/*****************************************************************************
 * Objetivo: Manipulação de dados.
 * Autor: Genivania Macedo
 * Data: 22/08/2023
 * Versão: 1.0
 ****************************************************************************/

/*
 * Express - dependencia do Node, que permite a integração entre o protocolo http com o código
 *     npm install express --save
 * 
 * Cors - Gerenciador de permissões para o protocolo HTTP
 *     npm install cors --save
 * 
 * Body-parser - É uma dependencia que permite manipular dados enviados pelo body da requisição 
 *     npm install body-parser --save
 */

/*
    Para realizar  a conexão com Banco e dados iremos utilizar o PRISMA
        npm install prisma --save
        npx prisma
        npx prisma init
        npm install @prisma/client
 */

//Import das bibliotecas do projeto
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { request, response } = require('express');

const app = express();

app.use((request, response, next) => {
    //Permissões de origin da requisição
    response.header('Access-Control-Allow-Origin', '*')

    //Permissões de metodos que serao utilizados na api
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    //Define as perissões para o cors
    app.use(cors())

    //Continua para a leitura dos EndPoints
    next();

});

//CRUD (Create, Read, Update e Delete)

const bodyJSON = bodyParser.json();


//Import da controller do usuario
var controllerHemocentro = require('./controller/controller_hemocentro.js');

var controllerUsuario = require('./controller/controller_usuario.js');


//EndPoints: 

app.post('/api/v1/hospital-registration', cors(), bodyJSON, async function(request, response) {

    //Recebe os dados encaminhados no body da requisição
    let dadosBody = request.body;

    console.log(dadosBody)

    //Envia os dados para a controller
    let resultInsertDados = await controllerHemocentro.inserirHemocentro(dadosBody);

    //Retorna o status code e a message
    response.status(resultInsertDados.status);
    response.json(resultInsertDados)

});



app.listen(8080, function() {
    console.log('Servidor aguardando requisições na porta 8080!')
})