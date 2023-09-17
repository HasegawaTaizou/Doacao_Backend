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

const getReviewsStatisticsByHospitalId = async function (hospitalId) {
  let sql = `
  SELECT 
  oneStarsRating,
  twoStarsRating,
  threeStarsRating,
  fourStarsRating,
  fiveStarsRating,
  totalReviews,
  ROUND((oneStarsRating * 1 + twoStarsRating * 2 + threeStarsRating * 3 + fourStarsRating * 4 + fiveStarsRating * 5) / totalReviews, 1) AS average
FROM (
  SELECT
    SUM(CASE WHEN id_star = 1 THEN 1 ELSE 0 END) AS oneStarsRating,
    SUM(CASE WHEN id_star = 2 THEN 1 ELSE 0 END) AS twoStarsRating,
    SUM(CASE WHEN id_star = 3 THEN 1 ELSE 0 END) AS threeStarsRating,
    SUM(CASE WHEN id_star = 4 THEN 1 ELSE 0 END) AS fourStarsRating,
    SUM(CASE WHEN id_star = 5 THEN 1 ELSE 0 END) AS fiveStarsRating,
    COUNT(*) AS totalReviews
  FROM tbl_review
  INNER JOIN tbl_hospital ON tbl_hospital.id = tbl_review.id_hospital
  WHERE tbl_hospital.id = ${hospitalId}
) AS subquery;
  `;

  let responseReviewsStatistics = await prisma.$queryRawUnsafe(sql);

  console.log("response reviews statistics: ", responseReviewsStatistics);

  if (responseReviewsStatistics) {
    return responseReviewsStatistics;
  } else {
    return false;
  }
};

module.exports = {
  insertReview,
  getReviewsStatisticsByHospitalId,
};
