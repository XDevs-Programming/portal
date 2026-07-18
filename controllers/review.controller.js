const Review = require("../models/Review");
const Commission = require("../models/Commission");

/* ==================================
   Submit Review
================================== */

exports.createReview = async (req, res) => {
    try {
        const {
            commissionId,
            rating,
            content
        } = req.body;

        const numericRating = Number(rating);

        if (
            !commissionId ||
            !content ||
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "A commission, rating from 1 to 5, and review are required."
            });
        }

        const commission = await Commission.findOne({
            _id: commissionId,
            client: req.user._id
        });

        if (!commission) {
            return res.status(404).json({
                success: false,
                message: "Commission not found."
            });
        }

        if (commission.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message: "Reviews can only be submitted for completed commissions."
            });
        }

        const existingReview = await Review.findOne({
            commission: commission._id
        });

        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: "A review has already been submitted for this commission."
            });
        }

        const review = await Review.create({
            client: req.user._id,
            commission: commission._id,
            rating: numericRating,
            content: content.trim()
        });

        await review.populate("client", "username");
        await review.populate("commission", "title");

        return res.status(201).json({
            success: true,
            message: "Review submitted and awaiting approval.",
            review
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A review has already been submitted for this commission."
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ==================================
   Get Client's Own Reviews
================================== */

exports.getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            client: req.user._id
        })
            .populate("commission", "title status")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            reviews
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ==================================
   Get Public Approved Reviews
================================== */

exports.getPublicReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            approved: true,
            hidden: false
        })
            .populate("client", "username")
            .populate("commission", "title")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            reviews
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ==================================
   Get Featured Reviews
================================== */

exports.getFeaturedReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            approved: true,
            featured: true,
            hidden: false
        })
            .populate("client", "username")
            .populate("commission", "title")
            .sort({ createdAt: -1 })
            .limit(3);

        return res.json({
            success: true,
            reviews
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};