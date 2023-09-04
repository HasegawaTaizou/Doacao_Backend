var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const siteInsert = async function (siteData) {

    let sqlSite = `insert into tbl_site (site) values 
                                ('${siteData}')`;

    let resultSite = await prisma.$executeRawUnsafe(sqlSite);

    let sqlSiteId = `SELECT LAST_INSERT_ID() AS site_id;`;
    const resultSiteId = await prisma.$queryRawUnsafe(sqlSiteId);

    let siteId = Number(resultSiteId[0].site_id);
    console.log("ID do site inserido:", siteId);

    if (resultSite) {
        return siteId;
    } else {
        return false
    };
};

const otherSiteInsert = async function (otherSiteData) {

    let sqlOtherSite = `insert into tbl_site (site) values ('${otherSiteData}')`;

    let resultOtherSite = await prisma.$executeRawUnsafe(sqlOtherSite);

    let sqlOtherSiteId = `SELECT LAST_INSERT_ID() AS other_site_id;`;
    const resultOtherSiteId = await prisma.$queryRawUnsafe(sqlOtherSiteId);

    let otherSiteId = Number(resultOtherSiteId[0].other_site_id);
    console.log("ID do other site inserido:", otherSiteId);

    if (resultOtherSite) {
        return otherSiteId;
    } else {
        return false
    };
}

module.exports = {
    siteInsert,
    otherSiteInsert,
};
