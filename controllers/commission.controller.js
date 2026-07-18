const Commission = require("../models/Commission");


// ==================================
// Create Commission Request
// ==================================

exports.createCommission = async (req, res) => {

    try {


        const {
            title,
            description,
            category,
            budget
        } = req.body;



        const commission = await Commission.create({

            client: req.user._id,

            title,

            description,

            category,

            budget

        });



        res.status(201).json({

            success:true,

            message:"Commission submitted successfully",

            commission

        });



    } catch(error) {


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};




// ==================================
// Get Client Commissions
// ==================================

exports.getMyCommissions = async (req, res) => {


    try {


        const commissions =
            await Commission.find({

                client:req.user._id

            })
            .sort({
                createdAt:-1
            });



        res.json({

            success:true,

            commissions

        });



    } catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};