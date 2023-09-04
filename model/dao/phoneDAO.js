var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const phoneInsert = async function (phoneData, hospitalId) {

    let sqlPhone = `insert into tbl_phone (phone, id_hospital)
                        values ('${phoneData}', ${hospitalId})`;

    let resultPhone = await prisma.$executeRawUnsafe(sqlPhone);

    if (resultPhone) {
        return resultPhone;
    } else {
        return false
    };
};

module.exports = {
    phoneInsert,
};
