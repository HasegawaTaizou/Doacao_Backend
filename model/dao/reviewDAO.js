var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

async function insertReview(reviewData) {
  let [day, month, year] = new Date().toLocaleDateString().split("/");
  let ISOdate = `${year}-${month}-${day}T00:00:00Z`;
  
  try {
    const insertReviewData = await prisma.review.create({
      data: {
        opinion: reviewData.opinion,
        date: ISOdate,
        idUser: reviewData.idUser,
        idHospital: reviewData.idHospital,
        idStar: reviewData.idStar,
      },
    });

    console.log(insertReviewData);

    return true;
  } catch (error) {
    console.error("Erro ao criar o review:", error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  insertReview,
};
