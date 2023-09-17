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

const ratingsStatisticsGet = async function (hospitalId) {
  if (false) {
    return message.ERROR_REQUIRED_DATA;
  } else {
    let ratingsStatisticsData =
      await reviewDAO.getRatingsStatisticsByHospitalId(hospitalId);

    let jsonRatingsStatisticsData = {};

    if (ratingsStatisticsData) {
      console.log(`Ratings Statistics Data: ${ratingsStatisticsData}`);
      jsonRatingsStatisticsData.status = 200;
      jsonRatingsStatisticsData.ratingsStatistics = {
        oneStarsRating: ratingsStatisticsData[0].oneStarsRating,
        twoStarsRating: ratingsStatisticsData[0].twoStarsRating,
        threeStarsRating: ratingsStatisticsData[0].threeStarsRating,
        fourStarsRating: ratingsStatisticsData[0].fourStarsRating,
        fiveStarsRating: ratingsStatisticsData[0].fiveStarsRating,
        totalReviews: Number(ratingsStatisticsData[0].totalReviews),
        average: ratingsStatisticsData[0].average,
      };

      return jsonRatingsStatisticsData;
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
      jsonReviewsStatisticsData.reviewsStatistics = reviewsStatisticsData

      return jsonReviewsStatisticsData;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

module.exports = {
  reviewInsert,
  ratingsStatisticsGet,
  reviewsStatisticsGet,
};
