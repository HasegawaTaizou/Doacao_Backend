const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { request, response } = require("express");

const app = express();

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  app.use(cors());
  next();
});

const bodyJSON = bodyParser.json();

const hospitalController = require("./controller/hospitalController.js");
const bookScheduleController = require("./controller/bookScheduleController.js");
const userController = require("./controller/userController.js");
const scheduleController = require("./controller/scheduleController.js");
const scheduleStatusController = require("./controller/scheduleStatusController.js");
const siteController = require("./controller/siteController.js");

//ENDPOINTS:

//Hospital Registration
app.post(
  "/api/v1/hospital-registration",
  cors(),
  bodyJSON,
  async function (request, response) {
    let bodyData = request.body;

    let resultInsertData = await hospitalController.hospitalInsert(bodyData);

    response.status(resultInsertData.status);
    response.json(resultInsertData);
  }
);

//Get Hospital
app.get(
  "/api/v1/hospital-data/:id",
  cors(),
  async function (request, response) {
    let hospitalId = request.params.id;

    let resultGetData = await hospitalController.hospitalGet(hospitalId);

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
);

//Book Schedule Registration
app.post(
  "/api/v1/book-schedules",
  cors(),
  bodyJSON,
  async function (request, response) {
    let bodyData = request.body;

    let resultInsertData = await bookScheduleController.bookScheduleInsert(
      bodyData
    );

    response.status(resultInsertData.status);
    response.json(resultInsertData);
  }
);

//User Registration
app.post(
  "/api/v1/user-registration",
  cors(),
  bodyJSON,
  async function (request, response) {
    let bodyData = request.body;

    let resultInsertData = await userController.userInsert(bodyData);

    response.status(resultInsertData.status);
    response.json(resultInsertData);
  }
);

//Schedule Registration
app.post(
  "/api/v1/schedule",
  cors(),
  bodyJSON,
  async function (request, response) {
    let bodyData = request.body;

    let resultInsertData = await scheduleController.scheduleInsert(bodyData);

    response.status(resultInsertData.status);
    response.json(resultInsertData);
  }
);

//Schedule Status Registration
app.post(
  "/api/v1/schedule-status",
  cors(),
  bodyJSON,
  async function (request, response) {
    let bodyData = request.body;

    let resultInsertData = await scheduleStatusController.scheduleStatusInsert(
      bodyData
    );

    response.status(resultInsertData.status);
    response.json(resultInsertData);
  }
);

//Get Schedules
app.get(
  "/api/v1/hospital/schedules",
  cors(),
  async function (request, response) {
    let resultGetData = await hospitalController.hospitalGetSchedules();

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
);

//Get Hospital Sites
app.get(
  "/api/v1/hospital/:id/sites",
  cors(),
  async function (request, response) {
    let hospitalId = request.params.id;

    let resultGetData = await siteController.getSites(hospitalId);

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
);

app.listen(8080, function () {
  console.log("Servidor aguardando requisições na porta 8080!");
});
