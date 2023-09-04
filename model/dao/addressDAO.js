var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const addressInsert = async function (addressData) {
    console.log('address data: ', addressData);

    let sqlAddress = `insert into tbl_address (cep, uf, city, neighborhood, road, number, complement)
                                        values (
                                        '${addressData.cep}',
                                        '${addressData.state}',
                                        '${addressData.city}',
                                        '${addressData.neighborhood}',
                                        '${addressData.road}',
                                        '${addressData.number}',
                                        '${addressData.complement}'
                                        )
                                        `;

    let resultAddress = await prisma.$executeRawUnsafe(sqlAddress);

    let sqlAddressId = `SELECT LAST_INSERT_ID() AS address_id;`;
    const resultAddressId = await prisma.$queryRawUnsafe(sqlAddressId);

    let addressId = Number(resultAddressId[0].address_id);

    if (resultAddress) {
        return addressId;
    } else {
        return false
    };
};

module.exports = {
    addressInsert,
};
