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
const reviewController = require("./controller/reviewController.js");

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

    let resultGetData = await siteController.sitesGet(hospitalId);

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
);

//Get User
app.get("/api/v1/users/:id", cors(), async function (request, response) {
  let userId = request.params.id;

  let resultGetData = await userController.userGet(userId);

  response.status(resultGetData.status);
  response.json(resultGetData);
});

//Get User Schedules
app.get(
  "/api/v1/users/:id/schedules",
  cors(),
  async function (request, response) {
    let userId = request.params.id;

    let resultGetData = await userController.userGetSchedules(userId);

    console.log(resultGetData);

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
);

//Get Hospital Book Schedules
app.get(
  "/api/v1/hospital/:id/book-schedules",
  cors(),
  async function (request, response) {
    let hospitalId = request.params.id;

    let resultGetData = await bookScheduleController.bookSchedulesGet(
      hospitalId
    );

    console.log(resultGetData);

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
);

//Get Hospital Schedules Statistics
app.get(
  "/api/v1/hospital/:id/statistics/schedules",
  cors(),
  async function (request, response) {
    let hospitalId = request.params.id;

    let resultGetData = await scheduleController.schedulesStatisticsGet(
      hospitalId
    );

    console.log(resultGetData);

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
);

//Review Registration
app.post(
  "/api/v1/review-registration",
  cors(),
  bodyJSON,
  async function (request, response) {
    let bodyData = request.body;

    let resultInsertData = await reviewController.reviewInsert(bodyData);

    response.status(resultInsertData.status);
    response.json(resultInsertData);
  }
);

//Get Hospital Ratings Statistics
app.get(
  "/api/v1/hospital/:id/statistics/ratings",
  cors(),
  async function (request, response) {
    let hospitalId = request.params.id;

    let resultGetData = await reviewController.reviewsStatisticsGet(hospitalId);

    console.log(resultGetData);

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
);

//Get Hospital Reviews Statistics
app.get(
  "/api/v1/hospital/:id/statistics/reviews",
  cors(),
  async function (request, response) {
    let hospitalId = request.params.id;

    let resultGetData = await reviewController.reviewsStatisticsGet(hospitalId);

    console.log(resultGetData);

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
);

//Hospital Update
app.put(
  "/api/v1/hospital/:id",
  cors(),
  bodyJSON,
  async function (request, response) {
    let hospitalId = request.params.id;
    let bodyData = request.body;

    let resultUpdateData = await hospitalController.hospitalUpdate(
      hospitalId,
      bodyData
    );

    response.status(resultUpdateData.status);
    response.json(resultUpdateData);
  }
);

//Schedule Cancel Update
app.put(
  "/api/v1/schedule-cancel/:id",
  cors(),
  bodyJSON,
  async function (request, response) {
    let scheduleId = request.params.id;
    let bodyData = request.body;

    let resultUpdateData = await scheduleController.scheduleCancelUpdate(
      scheduleId,
      bodyData
    );

    response.status(resultUpdateData.status);
    response.json(resultUpdateData);
  }
);

app.put(
  "/api/v1/schedule-conclude/:id",
  cors(),
  async function (request, response) {
    let scheduleId = request.params.id;

    let resultUpdateData = await scheduleController.scheduleConcludeUpdate(
      scheduleId
    );

    response.status(resultUpdateData.status);
    response.json(resultUpdateData);
  }
);

app.put(
  "/api/v1/schedule-reschedule/:id",
  cors(),
  bodyJSON,
  async function (request, response) {
    let scheduleId = request.params.id;
    let bodyData = request.body;

    let resultUpdateData = await scheduleController.scheduleRescheduleUpdate(
      scheduleId,
      bodyData
    );

    response.status(resultUpdateData.status);
    response.json(resultUpdateData);
  }
);

app.listen(8080, function () {
  console.log("Server waiting for requests on port 8080!");
});
