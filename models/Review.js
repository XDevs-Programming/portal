const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        commission: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Commission",
            required: true,
            unique: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 1000
        },

        approved: {
            type: Boolean,
            default: false
        },

        featured: {
            type: Boolean,
            default: false
        },

        hidden: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Review", reviewSchema);