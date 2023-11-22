const path = require("path");
const nodemailer = require("nodemailer");
const handlebars = require("nodemailer-express-handlebars");

//Gmail
// const {
//   service,
//   host,
//   port,
//   secure,
//   rejectUnauthorized,
// } = require("../controller/module/mailGmail.json");

//Mailtrap.io
// const {
//   host,
//   port,
//   user,
//   pass,
// } = require("../controller/module/mailMailbox.json");

//Brevo
const {
  host,
  port,
  secure,
} = require("../controller/module/mailBrevo.json");

//Env Path
const envPath = path.resolve(__dirname, "../prisma/");
require("dotenv").config({ path: `${envPath}/.env` });

//Mailtrap.io Config
// const mailtrapConfig = {
//   host,
//   port,
//   auth: {
//     user,
//     pass,
//   },
// };

//Gmail Config
// const gmailConfig = {
//   service,
//   host,
//   port,
//   secure,
//   tls: {
//     rejectUnauthorized,
//   },
//   auth: {
//     user: process.env.USER_EMAIL,
//     pass: process.env.PASS_EMAIL,
//   },
// };

const brevoConfig = {
  host,
  port,
  secure,
  auth: {
    user: process.env.USER_EMAIL_BREVO,
    pass: process.env.PASS_EMAIL_BREVO,
  },
};

//Mailtrap
// const transport = nodemailer.createTransport(mailtrapConfig);

//Gmail
// const transport = nodemailer.createTransport(gmailConfig);

//Brevo
const transport = nodemailer.createTransport(brevoConfig);

transport.use(
  "compile",
  handlebars({
    viewEngine: {
      defaultLayout: undefined,
      partialsDir: path.resolve("./src/resources/mail/"),
    },
    viewPath: path.resolve("./src/resources/mail/"),
    extName: ".html",
  })
);

module.exports = transport;
