var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const scheduleDAO = require("./scheduleDAO");

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
  }
  await prisma.$disconnect();

  return true;
};

const getBookScheduleByHospitalId = async function (hospitalId) {
  const sql = `
  SELECT * FROM tbl_book_schedule WHERE id = ${hospitalId};
  `;

  const responseBookSchedule = await prisma.$queryRawUnsafe(sql);

  if (responseBookSchedule) {
    return responseBookSchedule;
  } else {
    return false;
  }
};

const getBookSchedulesByHospitalId = async function (hospitalId) {
  const sql = `
  SELECT 
  tbl_hospital.name,
  tbl_book_schedule.id, 
  DATE_FORMAT(tbl_book_schedule.date, '%d/%m/%Y') AS date,
  TIME_FORMAT(tbl_book_schedule.hour, '%H:%i') AS hour, 
  tbl_site.site,
  tbl_site.id AS site_id 
  FROM tbl_book_schedule
  INNER JOIN tbl_hospital_site ON tbl_book_schedule.id_hospital_site = tbl_hospital_site.id
  INNER JOIN tbl_hospital ON tbl_hospital_site.id_hospital = tbl_hospital.id
  INNER JOIN tbl_site ON tbl_hospital_site.id = tbl_site.id
  WHERE tbl_hospital.id = ${hospitalId}
  ORDER BY tbl_book_schedule.date, tbl_book_schedule.hour;
  `;

  const responseBookSchedules = await prisma.$queryRawUnsafe(sql);

  if (responseBookSchedules) {
    return responseBookSchedules;
  } else {
    return false;
  }
};

const getBookSchedulesByHospitalIdMobile = async function (hospitalId) {
  const sql = `
SELECT 
  tbl_book_schedule.id AS book_schedule_id, 
  tbl_hospital.name,
  DATE_FORMAT(tbl_book_schedule.date, '%d/%m/%Y') AS date,
  TIME_FORMAT(tbl_book_schedule.hour, '%H:%i') AS hour, 
  tbl_site.site,
  tbl_site.id AS site_id
FROM tbl_book_schedule
LEFT JOIN tbl_schedule ON tbl_schedule.id_book_schedule = tbl_book_schedule.id
LEFT JOIN tbl_schedule_status ON tbl_schedule.id = tbl_schedule_status.id_schedule
LEFT JOIN tbl_status ON tbl_status.id = tbl_schedule_status.id_status
LEFT JOIN tbl_hospital_site ON tbl_book_schedule.id_hospital_site = tbl_hospital_site.id
LEFT JOIN tbl_hospital ON tbl_hospital_site.id_hospital = tbl_hospital.id
LEFT JOIN tbl_site ON tbl_hospital_site.id = tbl_site.id
WHERE tbl_hospital.id = 1 AND tbl_status.status IS NULL

UNION

SELECT 
  tbl_book_schedule.id AS book_schedule_id, 
  tbl_hospital.name,
  DATE_FORMAT(tbl_book_schedule.date, '%d/%m/%Y') AS date,
  TIME_FORMAT(tbl_book_schedule.hour, '%H:%i') AS hour, 
  tbl_site.site,
  tbl_site.id AS site_id
FROM tbl_book_schedule
RIGHT JOIN tbl_schedule ON tbl_schedule.id_book_schedule = tbl_book_schedule.id
RIGHT JOIN tbl_schedule_status ON tbl_schedule.id = tbl_schedule_status.id_schedule
RIGHT JOIN tbl_status ON tbl_status.id = tbl_schedule_status.id_status
RIGHT JOIN tbl_hospital_site ON tbl_book_schedule.id_hospital_site = tbl_hospital_site.id
RIGHT JOIN tbl_hospital ON tbl_hospital_site.id_hospital = tbl_hospital.id
RIGHT JOIN tbl_site ON tbl_hospital_site.id = tbl_site.id
WHERE tbl_hospital.id = 1 AND tbl_status.status IS NULL;
  `;

  const responseBookSchedules = await prisma.$queryRawUnsafe(sql);

  if (responseBookSchedules) {
    return responseBookSchedules;
  } else {
    return false;
  }
};

async function updateBookSchedule(bookScheduleId, bookScheduleData) {
  let [day, month, year] = bookScheduleData.date.split("/");
  let ISOdate = `${year}-${month}-${day}T00:00:00Z`;

  let [hour, minute] = bookScheduleData.hour.split(":");
  let ISOhour = `1970-01-01T${hour}:${minute}:00Z`;

  try {
    const oldBookScheduleData = await prisma.bookSchedule.findUnique({
      where: {
        id: Number(bookScheduleId),
      },
      include: {
        HospitalSite: {
          select: {
            idSite: true,
          },
        },
      },
    });

    const updatedBookSchedule = await prisma.bookSchedule.update({
      where: {
        id: Number(bookScheduleId),
      },
      data: {
        date: ISOdate,
        hour: ISOhour,
        HospitalSite: {
          update: {
            idSite: bookScheduleData.idSite,
          },
        },
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao atualizar o schedule:", error);
  } finally {
    await prisma.$disconnect();
  }
}

const deleteBookSchedule = async function (bookScheduleId) {
  try {
    //Só pode um agendamento por reserva. A lógica está correta
    const scheduleId = await scheduleDAO.getScheduleIdByBookScheduleId(
      bookScheduleId
    );

    if (scheduleId.length != 0) {
      // Excluir da tabela tbl_schedule_status
      await prisma.scheduleStatus.deleteMany({
        where: {
          idSchedule: scheduleId[0].id_schedule,
        },
      });

      // Excluir da tabela tbl_schedule
      await prisma.schedule.deleteMany({
        where: {
          idBookSchedule: Number(bookScheduleId),
        },
      });
    }

    // Excluir da tabela tbl_book_schedule
    await prisma.bookSchedule.delete({
      where: {
        id: Number(bookScheduleId),
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao excluir o agendamento:", error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  insertBookSchedule,
  getBookScheduleByHospitalId,
  getBookSchedulesByHospitalId,
  getBookSchedulesByHospitalIdMobile,
  updateBookSchedule,
  deleteBookSchedule,
};
