const express = require("express");

const router = express.Router();



const protect =
require("../middleware/auth.middleware");


const adminOnly =
require("../middleware/admin.middleware");



const {
    getAllCommissions,
    updateCommissionStatus,
    deleteCommission,
    getAllReviews,
    updateReview,
    deleteReview
} = require("../controllers/admin.controller");





// Get all commissions

router.get(

    "/commissions",

    protect,

    adminOnly,

    getAllCommissions

);





// Update commission status

router.patch(

    "/commission/:id/status",

    protect,

    adminOnly,

    updateCommissionStatus

);

router.delete(

    "/commission/:id",

    protect,

    adminOnly,

    deleteCommission

);

/* ==================================
   Review Administration
================================== */

router.get(
    "/reviews",
    protect,
    adminOnly,
    getAllReviews
);


router.patch(
    "/review/:id",
    protect,
    adminOnly,
    updateReview
);


router.delete(
    "/review/:id",
    protect,
    adminOnly,
    deleteReview
);

module.exports = router;