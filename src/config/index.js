import dotenv from "dotenv";
dotenv.config();
const config = {
    port : process.env.PORT || 3000,
    env : process.env.NODE_ENV || "development",
    mongo:{
        uri: process.env.MONGO_URI
    },
    jwt:{
        access_secret : process.env.JWT_ACCESS_TOKEN_SECRET,
        access_expiry : process.env.JWT_ACCESS_TOKEN_EXPIRY,
    },
    cookie:{
        domain : process.env.COOKIE_DOMAIN,
        secure : process.env.COOKIE_SECURE
    },
    cors:{
        origin : process.env.CORS_ORIGIN
    },
    logLevel: process.env.LOG_LEVEL
};

export default config;