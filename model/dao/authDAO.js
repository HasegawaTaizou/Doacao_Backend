var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const getEmailByToken = async function (tokenData) {
  let table = "";

  if (tokenData.type == "hospital") {
    table = "tbl_hospital";
  } else if (tokenData.type == "user") {
    table = "tbl_user";
  }

  const sql = `
  SELECT email FROM ${table}
  WHERE password_reset_token = '${tokenData.token}'
  `;

  const responseEmail = await prisma.$queryRawUnsafe(sql);

  if (responseEmail) {
    return responseEmail;
  } else {
    return false;
  }
};

module.exports = {
  getEmailByToken,
};
