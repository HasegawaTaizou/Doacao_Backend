const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { request, response } = require("express");
const https = require("https");
//Websocket
const http = require("http");
const WebSocket = require("ws");
const crypto = require("crypto");
const mailer = require("./modules/mailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

const app = express();

//SWAGGER
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./src/swagger.json");

//SWAGGER DOCUMENTATION
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
const authDAO = require("./model/dao/authDAO.js");

//ENDPOINTS:

//Hospital Registration
app.post(
  "/api/v1/hospital-registration",
  cors(),
  bodyJSON,
  async function (request, response) {
    const bodyData = request.body;

    const resultInsertData = await hospitalController.hospitalInsert(bodyData);

    const __dirname = path.resolve();
    const filePath = path.join(
      __dirname,
      "./src/resources/mail/register_successful.html"
    );
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);

    const htmlToSend = source;

    const mailOptions = {
      subject: "Assunto do E-mail",
      // to: bodyData.hospital.email,
      to: "caiocoghi@gmail.com",
      from: "doevida.suporte@gmail.com",
      html: htmlToSend,
    };

    mailer.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return response
          .status(400)
          .send({ error: "Cannot send forgot password email" });
      } else {
        return response.send();
      }
    });

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
    const bodyData = request.body;

    const resultInsertData = await bookScheduleController.bookScheduleInsert(
      bodyData
    );

    try {
      if (resultInsertData.status === 201) {
        const hospitalId = await siteController.hospitalIdSiteIdGet(
          bodyData[0].hospitalSiteId
        );

        const updatedBookSchedules =
          await bookScheduleController.bookSchedulesGet(
            hospitalId.hospitalId[0].hospital_id
          );

        const updatedBookSchedulesMobile =
          await bookScheduleController.bookSchedulesMobileGet(
            hospitalId.hospitalId[0].hospital_id
          );

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const jsonData = JSON.stringify({
              type: "bookSchedules",
              data: updatedBookSchedules.bookSchedules,
            });
            client.send(jsonData);

            const jsonMobileData = JSON.stringify({
              type: "bookSchedulesMobile",
              data: updatedBookSchedulesMobile.bookSchedules,
            });
            client.send(jsonMobileData);
          }
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem via WebSocket:", error.message);
    }

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
    const bodyData = request.body;

    const resultInsertData =
      await scheduleStatusController.scheduleStatusInsert(bodyData);

    try {
      if (resultInsertData.status === 201) {
        const hospitalId = await scheduleController.hospitalIdScheduleIdGet(
          bodyData.idSchedule
        );
        const updatedSchedules = await hospitalController.hospitalGetSchedules(
          hospitalId.hospitalId[0].id_hospital
        );

        const userId = await scheduleController.userIdScheduleIdGet(
          bodyData.idSchedule
        );
        const updatedUserSchedules = await userController.userGetSchedules(
          userId.userId[0].id_user
        );

        const updatedBookSchedulesMobile =
          await bookScheduleController.bookSchedulesGet(
            hospitalId.hospitalId[0].id_hospital
          );

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const jsonData = JSON.stringify({
              type: "schedules",
              data: updatedSchedules.schedules,
            });
            client.send(jsonData);

            const jsonUserData = JSON.stringify({
              type: "userSchedules",
              data: updatedUserSchedules.schedules,
            });
            client.send(jsonUserData);

            const jsonMobileData = JSON.stringify({
              type: "bookSchedulesMobile",
              data: updatedBookSchedulesMobile.bookSchedules,
            });
            client.send(jsonMobileData);
          }
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem via WebSocket:", error.message);
    }

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

//Get Schedules
app.get(
  "/api/v1/hospital/:id/schedules-status/:status",
  cors(),
  async function (request, response) {
    const hospitalId = request.params.id;
    const status = request.params.status;

    const resultGetData =
      await hospitalController.hospitalGetFilteredStatusSchedules(
        hospitalId,
        status
      );

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
);

//Get Schedules
app.get(
  "/api/v1/hospital/:id/schedules/:name",
  cors(),
  async function (request, response) {
    const hospitalId = request.params.id;
    const name = request.params.name;

    const resultGetData =
      await hospitalController.hospitalGetFilteredNameSchedules(
        hospitalId,
        name
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
    const bodyData = request.body;

    const resultInsertData = await reviewController.reviewInsert(bodyData);

    try {
      if (resultInsertData.status === 201) {
        const updatedReviewsStatistics =
          await reviewController.reviewsStatisticsGet(bodyData.idHospital);

        const updatedRatingsStatistics =
          await reviewController.ratingsStatisticsGet(bodyData.idHospital);

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const jsonReviewData = JSON.stringify({
              type: "review",
              data: updatedReviewsStatistics.reviewsStatistics[
                updatedReviewsStatistics.reviewsStatistics.length - 1
              ],
            });
            client.send(jsonReviewData);

            const jsonReviewStatisticsData = JSON.stringify({
              type: "ratings",
              data: updatedRatingsStatistics.ratingsStatistics,
            });
            client.send(jsonReviewStatisticsData);
          }
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem via WebSocket:", error.message);
    }

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

    try {
      if (resultUpdateData.status === 204) {
        const hospitalId = await scheduleController.hospitalIdScheduleIdGet(
          scheduleId
        );
        const updatedSchedules = await hospitalController.hospitalGetSchedules(
          hospitalId.hospitalId[0].id_hospital
        );

        const userId = await scheduleController.userIdScheduleIdGet(scheduleId);
        const updatedUserSchedules = await userController.userGetSchedules(
          userId.userId[0].id_user
        );

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const jsonSchedulesData = JSON.stringify({
              type: "schedules",
              data: updatedSchedules.schedules,
            });
            client.send(jsonSchedulesData);

            const jsonUserSchedulesData = JSON.stringify({
              type: "userSchedules",
              data: updatedUserSchedules.schedules,
            });
            client.send(jsonUserSchedulesData);
          }
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem via WebSocket:", error.message);
    }

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

    try {
      if (resultUpdateData.status === 204) {
        const hospitalId = await scheduleController.hospitalIdScheduleIdGet(
          scheduleId
        );
        const updatedSchedules = await hospitalController.hospitalGetSchedules(
          hospitalId.hospitalId[0].id_hospital
        );

        const userId = await scheduleController.userIdScheduleIdGet(scheduleId);
        const updatedUserSchedules = await userController.userGetSchedules(
          userId.userId[0].id_user
        );

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const jsonSchedulesData = JSON.stringify({
              type: "schedules",
              data: updatedSchedules.schedules,
            });
            client.send(jsonSchedulesData);

            const jsonUserSchedulesData = JSON.stringify({
              type: "userSchedules",
              data: updatedUserSchedules.schedules,
            });
            client.send(jsonUserSchedulesData);
          }
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem via WebSocket:", error.message);
    }

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

    try {
      if (resultUpdateData.status === 204) {
        const hospitalId = await scheduleController.hospitalIdScheduleIdGet(
          scheduleId
        );
        const updatedSchedules = await hospitalController.hospitalGetSchedules(
          hospitalId.hospitalId[0].id_hospital
        );

        const userId = await scheduleController.userIdScheduleIdGet(scheduleId);
        const updatedUserSchedules = await userController.userGetSchedules(
          userId.userId[0].id_user
        );

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const jsonSchedulesData = JSON.stringify({
              type: "schedules",
              data: updatedSchedules.schedules,
            });
            client.send(jsonSchedulesData);

            const jsonUserSchedulesData = JSON.stringify({
              type: "userSchedules",
              data: updatedUserSchedules.schedules,
            });
            client.send(jsonUserSchedulesData);
          }
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem via WebSocket:", error.message);
    }

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

    try {
      if (resultUpdateData.status === 204) {
        const hospitalId =
          await bookScheduleController.hospitalIdBookScheduleIdGet(
            bookScheduleId
          );

        const updatedSchedules = await bookScheduleController.bookSchedulesGet(
          hospitalId.hospitalId[0].id_hospital
        );

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const jsonData = JSON.stringify({
              type: "bookSchedules",
              data: updatedSchedules.bookSchedules,
            });
            client.send(jsonData);
          }
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem via WebSocket:", error.message);
    }

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

    const hospitalId = await bookScheduleController.hospitalIdBookScheduleIdGet(
      bookScheduleId
    );

    const resultDeleteData = await bookScheduleController.bookScheduleDelete(
      bookScheduleId
    );

    try {
      if (resultDeleteData.status === 204) {
        const updatedSchedules = await bookScheduleController.bookSchedulesGet(
          hospitalId.hospitalId[0].id_hospital
        );

        const userId = await bookScheduleController.userIdBookScheduleIdGet(
          bookScheduleId
        );

        if (userId.status != 404) {
          const updatedUserSchedules = await userController.userGetSchedules(
            userId.userId[0].id_user
          );

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              if (userId.status != 404) {
                const jsonUserData = JSON.stringify({
                  type: "userSchedules",
                  data: updatedUserSchedules.schedules,
                });
                client.send(jsonUserData);
              }
            }
          });
        }

        const updatedUserBookSchedules =
          await bookScheduleController.bookSchedulesMobileGet(
            hospitalId.hospitalId[0].id_hospital
          );

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const jsonData = JSON.stringify({
              type: "bookSchedules",
              data: updatedSchedules.bookSchedules,
            });
            client.send(jsonData);

            const modifiedBookSchedules =
              updatedUserBookSchedules.bookSchedules.map((bookSchedule) => {
                return {
                  id: bookSchedule.book_schedule_id,
                  name: bookSchedule.name,
                  date: bookSchedule.date,
                  hour: bookSchedule.hour,
                  site: bookSchedule.site,
                  site_id: bookSchedule.site_id,
                };
              });

            const jsonUserBookSchedulesData = JSON.stringify({
              type: "bookSchedules",
              data: modifiedBookSchedules,
            });
            client.send(jsonUserBookSchedulesData);
          }
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem via WebSocket:", error.message);
    }

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
  const city = request.query.city;

  if (city) {
    const resultGetData = await hospitalController.hospitalsFiltteredGet(city);

    response.status(resultGetData.status);
    response.json(resultGetData);
  } else {
    const resultGetData = await hospitalController.hospitalsGet();

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
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
  const city = request.query.city;

  if (city) {
    const resultGetData = await campaignController.campaignsFiltteredGet(city);

    response.status(resultGetData.status);
    response.json(resultGetData);
  } else {
    const resultGetData = await campaignController.campaignsGet();

    response.status(resultGetData.status);
    response.json(resultGetData);
  }
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

    try {
      if (resultUpdateData.status === 204) {
        const hospitalId = await campaignController.hospitalIdCampaignIdGet(
          campaignId
        );

        const updatedCampaigns = await campaignController.campaignsHospitalGet(
          hospitalId.hospitalId[0].id_hospital
        );

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const jsonData = JSON.stringify({
              type: "campaigns",
              data: updatedCampaigns.campaigns,
            });
            client.send(jsonData);
          }
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem via WebSocket:", error.message);
    }

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

    const hospitalId = await campaignController.hospitalIdCampaignIdGet(
      campaignId
    );

    const resultDeleteData = await campaignController.campaignDelete(
      campaignId
    );

    try {
      if (resultDeleteData.status === 204) {
        const updatedCampaigns = await campaignController.campaignsHospitalGet(
          hospitalId.hospitalId[0].id_hospital
        );

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const jsonData = JSON.stringify({
              type: "campaigns",
              data: updatedCampaigns.campaigns,
            });
            client.send(jsonData);
          }
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem via WebSocket:", error.message);
    }

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
    const hospitalId = bodyData.hospitalId;

    const resultUpdateData = await donationBankController.donationBankUpdate(
      bodyData
    );

    try {
      if (resultUpdateData.status === 204) {
        const updatedDonationBanks =
          await donationBankController.donationBanksGet(hospitalId);

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const jsonData = JSON.stringify({
              type: "donationBanks",
              data: updatedDonationBanks.donationBanks,
            });
            client.send(jsonData);
          }
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem via WebSocket:", error.message);
    }

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

    let name = "";
    if (body.type === "user") {
      const user = await userController.userEmailGet(body);

      name = user.userData.name;

      const updateUser = await userController.userForgotPasswordUpdate(
        user.userData.id,
        passwordResetData
      );
    } else if (body.type === "hospital") {
      const hospital = await hospitalController.hospitalEmailGet(body);

      name = hospital.hospitalData.name;

      const updateHospital =
        await hospitalController.hospitalForgotPasswordUpdate(
          hospital.hospitalData.id,
          passwordResetData
        );
    } else {
      return response.status(400).send({ error: "Cannot send to wrong type" });
    }

    const __dirname = path.resolve();
    const filePath = path.join(
      __dirname,
      "./src/resources/mail/forgot_password.html"
    );
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);

    let modifiedToken = "";
    if (body.type === "user") {
      // modifiedToken = `http://20.206.241.108:80/forgot-password-new-password/u${token}`;
      modifiedToken = `http://localhost:5173/forgot-password-new-password/u${token}`;
    } else if (body.type === "hospital") {
      // modifiedToken = `http://localhost:5173/forgot-password-new-password/h${token}`;
      modifiedToken = `http://20.206.241.108:80/forgot-password-new-password/h${token}`;
    }

    const replacements = {
      link: modifiedToken,
      emailName: name,
    };

    const htmlToSend = template(replacements);

    const mailOptions = {
      subject: "Assunto do E-mail",
      // to: body.email,
      to: "caiocoghi@gmail.com",
      from: "doevida.suporte@gmail.com",
      html: htmlToSend,
    };

    mailer.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return response
          .status(400)
          .send({ error: "Cannot send forgot password email" });
      } else {
        return response.send();
      }
    });

    return response.send();
  }
);

//User Reset Password
app.post(
  "/api/v1/reset-password",
  cors(),
  bodyJSON,
  async function (request, response) {
    const bodyData = request.body;

    const email = await authDAO.getEmailByToken(bodyData);

    if (bodyData.type === "user") {
      const user = await userController.userEmailGet(email[0]);

      if (bodyData.token !== user.userData.passwordResetToken) {
        return response.status(400).send({ error: "Token Invalid" });
      }

      const now = new Date();

      if (now > user.userData.passwordResetExpires) {
        return response
          .status(400)
          .send({ error: "Token Expired. Generate a new one" });
      }

      const responseUpdate = await userController.userPasswordUpdate(
        user.userData.id,
        bodyData
      );

      response.status(responseUpdate.status);
      response.json(responseUpdate);
    } else if (bodyData.type === "hospital") {
      const hospital = await hospitalController.hospitalEmailGet(email[0]);

      if (bodyData.token !== hospital.hospitalData.passwordResetToken) {
        return response.status(400).send({ error: "Token Invalid" });
      }

      const now = new Date();

      if (now > hospital.hospitalData.passwordResetExpires) {
        return response
          .status(400)
          .send({ error: "Token Expired. Generate a new one" });
      }

      const responseUpdate = await hospitalController.hospitalPasswordUpdate(
        hospital.hospitalData.id,
        bodyData
      );

      response.status(responseUpdate.status);
      response.json(responseUpdate);
    } else {
      return response.status(500).send({ error: "Internal server Error" });
    }
  }
);

/* ---------------------------------- RUN BACKEND ----------------------------------*/
// const options = {
//   key: fs.readFileSync('/etc/letsencrypt/live/doacao-opal.vercel.app/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/doacao-opal.vercel.app/fullchain.pem'),
// };

// const server = https.createServer(options, app);
// const PORT = process.env.PORT || 443;

const PORT = process.env.PORT || 8080;

// Verifica se está rodando em um ambiente de teste e usa uma porta diferente
if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`Server waiting for requests on port ${PORT}!`);
  });
}

// const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  // console.log("Cliente conectado ao WebSocket");

  ws.on("message", (message) => {
    // console.log(`Mensagem recebida: ${message}`);
  });

  ws.on("close", () => {
    // console.log("Cliente desconectado do WebSocket");
  });
});

module.exports = app;
