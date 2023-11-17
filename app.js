const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { request, response } = require("express");
//Websocket
const http = require("http");
const WebSocket = require("ws");
const crypto = require("crypto");
const mailer = require("./modules/mailer");
const path = require("path");
const fs = require("fs");

const app = express();

//Websocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

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

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
);

//Get User Schedules Hospital
app.get(
  "/api/v1/hospital/:idHospital/users/:idUser/schedules",
  cors(),
  async function (request, response) {
    const hospitalId = request.params.idHospital;
    const userId = request.params.idUser;

    const resultGetData = await userController.userGetSchedulesHospital(
      hospitalId,
      userId
    );

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

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
);

//Get Hospital Book Schedules Mobile
app.get(
  "/api/v1/hospital/:id/book-schedules-mobile",
  cors(),
  async function (request, response) {
    const hospitalId = request.params.id;

    const resultGetData = await bookScheduleController.bookSchedulesMobileGet(
      hospitalId
    );

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
    const resultDeleteData = await userController.userDelete(userId);

    response.status(resultDeleteData.status);
    response.json(resultDeleteData);
  }
);

//Get Hospitals
app.get("/api/v1/hospitals", cors(), async function (request, response) {
  const resultGetData = await hospitalController.hospitalsGet();

  response.status(resultGetData.status);
  response.json(resultGetData);
});

//Get Hospital Campaigns
app.get(
  "/api/v1/hospital/:id/campaigns",
  cors(),
  async function (request, response) {
    const hospitalId = request.params.id;

    const resultGetData = await campaignController.campaignsHospitalGet(
      hospitalId
    );

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
);

//Get All Campaigns
app.get("/api/v1/campaigns", cors(), async function (request, response) {
  const resultGetData = await campaignController.campaignsGet();

  response.status(resultGetData.status);
  response.json(resultGetData);
});

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

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
);

app.get(
  "/api/v1/hospital/:id/donation-banks-years",
  cors(),
  async function (request, response) {
    const hospitalId = request.params.id;

    const resultGetData = await donationBankController.donationBankYearsGet(
      hospitalId
    );

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
    const bodyData = request.body;

    const resultUpdateData = await donationBankController.donationBankUpdate(
      bodyData
    );

    response.status(resultUpdateData.status);
    response.json(resultUpdateData);
  }
);

//Get Schedules
app.get("/api/v1/schedules", cors(), async function (request, response) {
  const resultGetData = await scheduleController.schedulesGet();

  response.status(resultGetData.status);
  response.json(resultGetData);
});

/* ---------------------------------- AUTHENTICATION ----------------------------------*/
app.post(
  "/api/v1/forgot-password",
  cors(),
  bodyJSON,
  async function (request, response) {
    const body = request.body;

    const token = crypto.randomBytes(20).toString("hex");

    //Expiration Date
    const now = new Date();
    now.setHours(now.getHours() + 1);

    //Update Password Reset Token
    const passwordResetData = {
      passwordResetToken: token,
      passwordResetExpires: now,
    };

    const user = await userController.userEmailGet(body);

    // TODO criar isso aqui
    const updateUser = await userController.userForgotPasswordUpdate(
      user.userData.id,
      passwordResetData
    );

    // const templatePath = path.resolve(
    //   __dirname,
    //   "src",
    //   "resources",
    //   "mail",
    //   "forgot_password.html"
    // );

    // const htmlContent = fs.readFileSync(templatePath, 'utf-8');
    const htmlContent = fs.readFileSync(
      "./src/resources/mail/forgot_password.html",
      "utf-8"
    );

    const mailOptions = {
      // to: body.email,
      from: "caiocoghi@gmail.com",
      to: "caiocoghi@gmail.com",
      html: htmlContent,
      context: { token },
    };

    // const mailOptions = {
    //   // to: body.email,
    //   from: "caiocoghi@gmail.com",
    //   to: "pinheirocamila49800@gmail.com",
    //   subject: "Assunto do E-mail",
    //   text: "Corpo do E-mail",
    // };

    mailer.sendMail(mailOptions, (error) => {
      if (error) {
        return response
          .status(400)
          .send({ error: "Cannot send forgot password email" });
      } else {
        console.log("foi");
        return response.send();
      }
    });
  }
);

//Insert Donation Bank
app.post(
  "/api/v1/reset-password",
  cors(),
  bodyJSON,
  async function (request, response) {
    const bodyData = request.body;

    const user = await userController.userEmailGet(body);

    if (bodyData.token !== user.userData.passwordResetToken) {
      return response.status(400).send({ error: "Token Invalid" });
    }

    const now = new Date();

    if (now > user.userData.passwordResetExpires) {
      return response
        .status(400)
        .send({ error: "Token Expired. Generate a new one" });
    }

    userController.userPasswordUpdate(user.userData.id, bodyData.password);

    response.status(resultDonationBank.status);
    response.json(resultDonationBank);
  }
);

/* ---------------------------------- RUN BACKEND ----------------------------------*/
const PORT = process.env.PORT || 8080;

// Verifica se está rodando em um ambiente de teste e usa uma porta diferente
if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`Server waiting for requests on port ${PORT}!`);
  });
}


wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
        console.log(`Sent: ${message}`);
      }
    });
  });
});

module.exports = app;
