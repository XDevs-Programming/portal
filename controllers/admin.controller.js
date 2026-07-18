const Commission = require("../models/Commission");
const Review = require("../models/Review");



// ==================================
// Get All Commissions
// ==================================

exports.getAllCommissions = async (req, res) => {


    try {


        const commissions =
            await Commission.find()

            .populate(
                "client",
                "username email"
            )

            .sort({
                createdAt:-1
            });



        res.json({

            success:true,

            commissions

        });



    } catch(error) {


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};





// ==================================
// Update Commission Status
// ==================================

exports.updateCommissionStatus = async (
    req,
    res
) => {


    try {


        const {
            status
        } = req.body;



        const commission =
            await Commission.findById(
                req.params.id
            );



        if(!commission){


            return res.status(404).json({

                success:false,

                message:"Commission not found"

            });


        }




        commission.status = status;


        await commission.save();



        res.json({

            success:true,

            message:"Commission status updated",

            commission

        });



    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};

// ==================================
// Delete Commission
// ==================================

exports.deleteCommission = async (
    req,
    res
) => {


    try {


        const commission =
            await Commission.findById(
                req.params.id
            );



        if(!commission){


            return res.status(404).json({

                success:false,

                message:"Commission not found"

            });


        }



        await commission.deleteOne();



        res.json({

            success:true,

            message:"Commission deleted"

        });



    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};

/* ==================================
   Get All Reviews
================================== */

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("client", "username email")
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
   Update Review
================================== */

exports.updateReview = async (req, res) => {
    try {
        const {
            approved,
            featured,
            hidden
        } = req.body;

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found."
            });
        }

        if (typeof approved === "boolean") {
            review.approved = approved;
        }

        if (typeof featured === "boolean") {
            review.featured = featured;
        }

        if (typeof hidden === "boolean") {
            review.hidden = hidden;
        }

        /*
         A hidden review should not remain featured.
        */

        if (review.hidden) {
            review.featured = false;
        }

        /*
         A featured review must also be approved.
        */

        if (review.featured) {
            review.approved = true;
            review.hidden = false;
        }

        await review.save();

        await review.populate("client", "username email");
        await review.populate("commission", "title");

        return res.json({
            success: true,
            message: "Review updated successfully.",
            review
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ==================================
   Delete Review
================================== */

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found."
            });
        }

        await review.deleteOne();

        return res.json({
            success: true,
            message: "Review deleted successfully."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};