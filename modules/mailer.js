const path = require("path");
const nodemailer = require("nodemailer");
const handlebars = require("nodemailer-express-handlebars");
const {
  service,
  host,
  secure,
  port,
  user,
  pass,
} = require("../controller/module/mail.json");

// const transport = nodemailer.createTransport({
//   service,
//   host,
//   secure,
//   // port,
//   auth: {
//     user,
//     pass,
//   },
// });

const transport = nodemailer.createTransport({
  service: "smtp.gmail.com",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: "aa@gmail.com", // Use variáveis de ambiente para armazenar o nome de usuário
    pass: "aa", // Use variáveis de ambiente para armazenar a senha
  },
});

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
