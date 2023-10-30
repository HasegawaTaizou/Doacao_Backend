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
const campaignController = require("./controller/campaignController.js");
const donationBankController = require("./controller/donationBankController.js");

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

//Hospital Login
app.post(
  "/api/v1/hospital-login",
  cors(),
  bodyJSON,
  async function (request, response) {
    const bodyData = request.body;

    const resultLogin = await hospitalController.loginHospital(bodyData);

    response.status(resultLogin.status);
    response.json(resultLogin);
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

//Hospital Get By Email
app.post(
  "/api/v1/hospital",
  cors(),
  bodyJSON,
  async function (request, response) {
    const bodyData = request.body;

    const resultHospital = await hospitalController.hospitalEmailGet(bodyData);

    response.status(resultHospital.status);
    response.json(resultHospital);
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

//Get Hospital Schedule
app.get(
  "/api/v1/hospital/:id/schedule",
  cors(),
  async function (request, response) {
    let hospitalId = request.params.id;

    let resultGetData = await scheduleController.scheduleGet(hospitalId);

    response.status(resultGetData.status);
    response.json(resultGetData);
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
  "/api/v1/hospital/:id/schedules",
  cors(),
  async function (request, response) {
    let hospitalId = request.params.id;

    let resultGetData = await hospitalController.hospitalGetSchedules(
      hospitalId
    );

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

    let resultGetData = await reviewController.ratingsStatisticsGet(hospitalId);

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
  "/api/v1/hospital-update",
  cors(),
  bodyJSON,
  async function (request, response) {
    let hospitalId = request.body.id;
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
  "/api/v1/schedule-cancel",
  cors(),
  bodyJSON,
  async function (request, response) {
    const scheduleId = request.body.id;
    const bodyData = request.body;

    const resultUpdateData = await scheduleController.scheduleCancelUpdate(
      scheduleId,
      bodyData
    );

    response.status(resultUpdateData.status);
    response.json(resultUpdateData);
  }
);

//Schedule Conclude Update
app.put(
  "/api/v1/schedule-conclude",
  cors(),
  bodyJSON,
  async function (request, response) {
    const scheduleId = request.body.id;

    const resultUpdateData = await scheduleController.scheduleConcludeUpdate(
      scheduleId
    );

    response.status(resultUpdateData.status);
    response.json(resultUpdateData);
  }
);

//Schedule Reschedule Update
app.put(
  "/api/v1/schedule-reschedule",
  cors(),
  bodyJSON,
  async function (request, response) {
    const scheduleId = request.body.id;
    const bodyData = request.body;

    const resultUpdateData = await scheduleController.scheduleRescheduleUpdate(
      scheduleId,
      bodyData
    );

    response.status(resultUpdateData.status);
    response.json(resultUpdateData);
  }
);

//Book Schedule Update
app.put(
  "/api/v1/update-book-schedule",
  cors(),
  bodyJSON,
  async function (request, response) {
    const bookScheduleId = request.body.id;
    const bodyData = request.body;

    const resultUpdateData = await bookScheduleController.bookScheduleUpdate(
      bookScheduleId,
      bodyData
    );

    response.status(resultUpdateData.status);
    response.json(resultUpdateData);
  }
);

//Book Schedule Delete
app.delete(
  "/api/v1/delete-book-schedule/:id",
  cors(),
  async function (request, response) {
    const bookScheduleId = request.params.id;
    const resultDeleteData = await bookScheduleController.bookScheduleDelete(
      bookScheduleId
    );

    response.status(resultDeleteData.status);
    response.json(resultDeleteData);
  }
);

//Hospital Password Update
app.put(
  "/api/v1/hospital/redefine-password",
  cors(),
  bodyJSON,
  async function (request, response) {
    const hospitalId = request.body.id;
    const bodyData = request.body;

    const resultUpdateData = await hospitalController.hospitalPasswordUpdate(
      hospitalId,
      bodyData
    );

    response.status(resultUpdateData.status);
    response.json(resultUpdateData);
  }
);

//Hospital Delete
app.delete(
  "/api/v1/delete-hospital/:id",
  cors(),
  async function (request, response) {
    const hospitalId = request.params.id;
    const resultDeleteData = await hospitalController.hospitalDelete(
      hospitalId
    );

    response.status(resultDeleteData.status);
    response.json(resultDeleteData);
  }
);

//User Get By Email
app.post("/api/v1/user", cors(), bodyJSON, async function (request, response) {
  const bodyData = request.body;

  const resultUser = await userController.userEmailGet(bodyData);

  response.status(resultUser.status);
  response.json(resultUser);
});

//User Login
app.post(
  "/api/v1/user-login",
  cors(),
  bodyJSON,
  async function (request, response) {
    const bodyData = request.body;

    const resultLogin = await userController.loginUser(bodyData);

    response.status(resultLogin.status);
    response.json(resultLogin);
  }
);

//User Update
app.put(
  "/api/v1/user-update",
  cors(),
  bodyJSON,
  async function (request, response) {
    const userId = request.body.id;
    const bodyData = request.body;

    const resultUpdateData = await userController.userUpdate(userId, bodyData);

    response.status(resultUpdateData.status);
    response.json(resultUpdateData);
  }
);

//User Password Update
app.put(
  "/api/v1/user/redefine-password",
  cors(),
  bodyJSON,
  async function (request, response) {
    const userId = request.body.id;
    const bodyData = request.body;

    const resultUpdateData = await userController.userPasswordUpdate(
      userId,
      bodyData
    );

    response.status(resultUpdateData.status);
    response.json(resultUpdateData);
  }
);

//User Delete
app.delete(
  "/api/v1/delete-user/:id",
  cors(),
  async function (request, response) {
    const userId = request.params.id;
    const resultDeleteData = await userController.userDelete(
      userId
    );

    response.status(resultDeleteData.status);
    response.json(resultDeleteData);
  }
);

//Get Hospitals
app.get("/api/v1/hospitals", cors(), async function (request, response) {
  const resultGetData = await hospitalController.hospitalsGet();

  console.log(resultGetData);

  response.status(resultGetData.status);
  response.json(resultGetData);
});

//Get Hospital Campaigns
app.get(
  "/api/v1/hospital/:id/campaigns",
  cors(),
  async function (request, response) {
    const hospitalId = request.params.id;

    const resultGetData = await campaignController.campaignsGet(hospitalId);

    console.log(resultGetData);

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
);

//Insert Campaign
app.post(
  "/api/v1/campaign",
  cors(),
  bodyJSON,
  async function (request, response) {
    const bodyData = request.body;

    const resultCampaign = await campaignController.campaignInsert(bodyData);

    response.status(resultCampaign.status);
    response.json(resultCampaign);
  }
);

//Update Campaign
app.put(
  "/api/v1/update-campaign",
  cors(),
  bodyJSON,
  async function (request, response) {
    const campaignId = request.body.id;
    const bodyData = request.body;

    const resultUpdateData = await campaignController.campaignUpdate(
      campaignId,
      bodyData
    );

    response.status(resultUpdateData.status);
    response.json(resultUpdateData);
  }
);

//Delete Campaign
app.delete(
  "/api/v1/delete-campaign/:id",
  cors(),
  async function (request, response) {
    const campaignId = request.params.id;
    const resultDeleteData = await campaignController.campaignDelete(
      campaignId
    );

    response.status(resultDeleteData.status);
    response.json(resultDeleteData);
  }
);

//Get Hospital Donation Banks
app.get(
  "/api/v1/hospital/:id/donation-banks",
  cors(),
  async function (request, response) {
    const hospitalId = request.params.id;

    const resultGetData = await donationBankController.donationBanksGet(
      hospitalId
    );

    console.log(resultGetData);

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
);

//Insert Donation Bank
app.post(
  "/api/v1/donation-bank",
  cors(),
  bodyJSON,
  async function (request, response) {
    const bodyData = request.body;

    const resultDonationBank = await donationBankController.donationBankInsert(
      bodyData
    );

    response.status(resultDonationBank.status);
    response.json(resultDonationBank);
  }
);

//Update Donation Bank
app.put(
  "/api/v1/update-donation-bank",
  cors(),
  bodyJSON,
  async function (request, response) {
    const donationBankId = request.body.id;
    const bodyData = request.body;

    const resultUpdateData = await donationBankController.donationBankUpdate(
      donationBankId,
      bodyData
    );

    response.status(resultUpdateData.status);
    response.json(resultUpdateData);
  }
);

app.listen(8080, function () {
  console.log("Server waiting for requests on port 8080!");
});
