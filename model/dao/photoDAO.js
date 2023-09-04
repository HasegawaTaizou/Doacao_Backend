var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const photoInsert = async function (photoData, hospitalId) {

    let sqlPhoto = `INSERT INTO tbl_photo (url, id_hospital) VALUES ('${photoData}', ${hospitalId});`;

    let resultPhoto = await prisma.$executeRawUnsafe(sqlPhoto);

    if (resultPhoto) {
        return resultPhoto;
    } else {
        return false
    };
};

module.exports = {
    photoInsert,
};
