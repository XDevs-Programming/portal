const express = require("express");

const router = express.Router();


const protect =
require("../middleware/auth.middleware");


const {

    createCommission,

    getMyCommissions

} = require("../controllers/commission.controller");




// Submit commission

router.post(
    "/",
    protect,
    createCommission
);




// View my commissions

router.get(
    "/my",
    protect,
    getMyCommissions
);



module.exports = router;