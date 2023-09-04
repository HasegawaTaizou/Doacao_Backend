var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const hospitalSiteInsert = async function (hospitalId, siteId) {

    let sqlHospitalSite = `insert into tbl_hospital_site (id_hospital, id_site)
                                                        values (${hospitalId}, ${siteId})`

    let resultHospitalSite = await prisma.$executeRawUnsafe(sqlHospitalSite);

    if (resultHospitalSite) {
        return true;
    } else {
        return false
    };
};

const hospitalOtherSiteInsert = async function (hospitalId, otherSiteId) {

    let sqlHospitalOtherSite = `insert into tbl_hospital_site (id_hospital, id_site)
                                                        values (${hospitalId}, ${otherSiteId})`;

    let resultHospitalOtherSite = await prisma.$executeRawUnsafe(sqlHospitalOtherSite);

    if (resultHospitalOtherSite) {
        return true;
    } else {
        return false
    };
};

module.exports = {
    hospitalSiteInsert,
    hospitalOtherSiteInsert,
};
