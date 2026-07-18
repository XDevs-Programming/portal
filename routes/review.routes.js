const express = require("express");

const protect = require("../middleware/auth.middleware");

const {
    createReview,
    getMyReviews,
    getPublicReviews,
    getFeaturedReviews
} = require("../controllers/review.controller");

const router = express.Router();

/*
Public review endpoints
*/

router.get("/", getPublicReviews);

router.get("/featured", getFeaturedReviews);

/*
Protected client endpoints
*/

router.get("/my", protect, getMyReviews);

router.post("/", protect, createReview);

module.exports = router;