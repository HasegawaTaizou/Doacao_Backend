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

module.exports = {
  reviewInsert,
};
