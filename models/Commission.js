const mongoose = require("mongoose");


const commissionSchema = new mongoose.Schema(
{

    client: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },


    title: {

        type: String,

        required: true,

        trim: true

    },


    description: {

        type: String,

        required: true

    },


    category: {

        type: String,

        required: true

    },


    budget: {

        type: String,

        default: "Not specified"

    },


    status: {

        type: String,

        enum: [

            "Pending",

            "Reviewing",

            "Accepted",

            "In Progress",

            "Testing",

            "Completed",

            "Rejected"

        ],

        default: "Pending"

    },


    adminNotes: {

        type: String,

        default: ""

    }


},
{

    timestamps:true

});


module.exports = mongoose.model(
    "Commission",
    commissionSchema
);