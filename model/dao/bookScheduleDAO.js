var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const insertBookSchedule = async function (bookScheduleData) {
  for (bookSchedule in bookScheduleData) {
    let [day, month, year] = bookScheduleData[bookSchedule].date.split("/");
    let ISOdate = `${year}-${month}-${day}T00:00:00Z`;

    let [hour, minute] = bookScheduleData[bookSchedule].hour.split(":");
    let ISOhour = `1970-01-01T${hour}:${minute}:00Z`;

    const insertBookScheduleData = await prisma.bookSchedule.create({
      data: {
        date: ISOdate,
        hour: ISOhour,
        idHospitalSite: bookScheduleData[bookSchedule].hospitalSiteId,
      },
    });

    console.log(insertBookScheduleData);
  }
  await prisma.$disconnect();

  return true;
};

const getBookSchedulesByHospitalId = async function (hospitalId) {
  let sql = `
  SELECT 
  tbl_book_schedule.id, 
  DATE_FORMAT(tbl_book_schedule.date, '%d/%m/%Y') AS date,
  TIME_FORMAT(tbl_book_schedule.hour, '%H:%i') AS hour,
  tbl_site.site 
  FROM tbl_book_schedule
  INNER JOIN tbl_hospital_site ON tbl_book_schedule.id_hospital_site = tbl_hospital_site.id
  INNER JOIN tbl_site ON tbl_site.id = tbl_hospital_site.id_site
  INNER JOIN tbl_hospital ON tbl_hospital.id = tbl_hospital_site.id_hospital
  WHERE tbl_hospital.id = ${hospitalId};
  `;

  let responseBookSchedules = await prisma.$queryRawUnsafe(sql);

  if (responseBookSchedules) {
    return responseBookSchedules;
  } else {
    return false;
  }
};

module.exports = {
  insertBookSchedule,
  getBookSchedulesByHospitalId,
};
