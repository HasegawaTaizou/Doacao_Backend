const reviewDAO = require("../model/dao/reviewDAO.js");

const message = require("./module/config.js");

const reviewInsert = async function (reviewData) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let status = await reviewDAO.insertReview(reviewData);
    if (status) {
      return message.CREATED_ITEM;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

const reviewsStatisticsGet = async function (hospitalId) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let reviewsStatisticsData =
      await reviewDAO.getReviewsStatisticsByHospitalId(hospitalId);

    let jsonReviewsStatisticsData = {};

    if (reviewsStatisticsData) {
      console.log(`Reviews Statistics Data: ${reviewsStatisticsData}`);
      jsonReviewsStatisticsData.status = 200;
      jsonReviewsStatisticsData.reviewsStatistics = {
        oneStarsRating: reviewsStatisticsData[0].oneStarsRating,
        twoStarsRating: reviewsStatisticsData[0].twoStarsRating,
        threeStarsRating: reviewsStatisticsData[0].threeStarsRating,
        fourStarsRating: reviewsStatisticsData[0].fourStarsRating,
        fiveStarsRating: reviewsStatisticsData[0].fiveStarsRating,
        totalReviews: Number(reviewsStatisticsData[0].totalReviews),
        average: reviewsStatisticsData[0].average,
      };

      return jsonReviewsStatisticsData;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

module.exports = {
  reviewInsert,
  reviewsStatisticsGet,
};
