const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ==========================
// Register User
// ==========================

exports.register = async (req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;


        const existingUser = await User.findOne({
            email
        });


        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });

        }


        const hashedPassword = await bcrypt.hash(
            password,
            12
        );


        const user = await User.create({

            username,

            email,

            password: hashedPassword

        });


        res.status(201).json({

            success: true,

            message: "Account created successfully",

            user: {

                id: user._id,

                username: user.username,

                email: user.email,

                role: user.role

            }

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ==========================
// Login User
// ==========================

exports.login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;



        const user = await User.findOne({
            email
        });



        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password"

            });

        }



        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );



        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password"

            });

        }



        const token = jwt.sign(

            {
                id: user._id,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: process.env.JWT_EXPIRES
            }

        );



        user.lastLogin = new Date();

        await user.save();



        res.json({

            success: true,

            message: "Login successful",

            token,

            user: {

                id: user._id,

                username: user.username,

                email: user.email,

                role: user.role

            }

        });



    } catch(error) {


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};

// ==========================
// Get Current User Profile
// ==========================

exports.profile = async (req, res) => {

    try {

        res.json({

            success: true,

            user: req.user

        });


    } catch(error) {

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};