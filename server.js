require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDatabase = require("./config/database");

const authRoutes = require("./routes/auth.routes");
const commissionRoutes = require("./routes/commission.routes");
const reviewRoutes = require("./routes/review.routes");
const adminRoutes = require("./routes/admin.routes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const PORT = Number(process.env.PORT) || 3000;

/*
|--------------------------------------------------------------------------
| Database
|--------------------------------------------------------------------------
*/

connectDatabase();

/*
|--------------------------------------------------------------------------
| Render / proxy configuration
|--------------------------------------------------------------------------
*/

app.set("trust proxy", 1);
app.disable("x-powered-by");

/*
|--------------------------------------------------------------------------
| Allowed frontend origins
|--------------------------------------------------------------------------
|
| In production, FRONTEND_URL should contain your Netlify URL:
|
| FRONTEND_URL=https://your-site.netlify.app
|
| Multiple URLs can be separated by commas:
|
| FRONTEND_URL=https://site.netlify.app,https://www.example.com
|
*/

const allowedOrigins = String(process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

if (process.env.NODE_ENV !== "production") {
    allowedOrigins.push(
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    );
}

console.log("Allowed frontend origins:", allowedOrigins);

/*
|--------------------------------------------------------------------------
| Security middleware
|--------------------------------------------------------------------------
*/

app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin"
        }
    })
);

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

const corsOptions = {
    origin(origin, callback) {
        /*
         * Requests with no origin include browser navigation,
         * health checks, Postman and server-to-server requests.
         */
        if (!origin) {
            return callback(null, true);
        }

        const normalizedOrigin = origin.replace(/\/$/, "");

        if (allowedOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        }

        console.error(`CORS blocked origin: ${origin}`);

        const error = new Error(
            `CORS blocked origin: ${origin}`
        );

        error.status = 403;

        return callback(error);
    },

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],

    credentials: false,

    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

/*
|--------------------------------------------------------------------------
| Body parsing and logging
|--------------------------------------------------------------------------
*/

app.use(
    express.json({
        limit: "1mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb"
    })
);

app.use(
    morgan(
        process.env.NODE_ENV === "production"
            ? "combined"
            : "dev"
    )
);

/*
|--------------------------------------------------------------------------
| Main API information
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "XDevs Programming API is running.",
        environment: process.env.NODE_ENV || "development"
    });
});

/*
|--------------------------------------------------------------------------
| Health check
|--------------------------------------------------------------------------
|
| Use this as your Render health-check path:
|
| /api/health
|
*/

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "xdevs-programming-api",
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

/*
|--------------------------------------------------------------------------
| API routes
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);
app.use("/api/commissions", commissionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

/*
|--------------------------------------------------------------------------
| 404 handler
|--------------------------------------------------------------------------
|
| This must appear after all valid routes.
|
*/

app.use(notFound);

/*
|--------------------------------------------------------------------------
| Error handler
|--------------------------------------------------------------------------
|
| This must always be the final middleware.
|
*/

app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| Start server
|--------------------------------------------------------------------------
|
| Render supplies its own PORT environment variable.
| Binding to 0.0.0.0 allows Render to access the server.
|
*/

app.listen(PORT, "0.0.0.0", () => {
    console.log("----------------------------------------");
    console.log("XDevs Programming API started");
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Port: ${PORT}`);
    console.log(`Health check: /api/health`);
    console.log("----------------------------------------");
});

/*
|--------------------------------------------------------------------------
| Process error handling
|--------------------------------------------------------------------------
*/

process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
    process.exit(1);
});