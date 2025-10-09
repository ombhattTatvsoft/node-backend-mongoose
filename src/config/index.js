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
        access_expiry_extend : process.env.JWT_ACCESS_TOKEN_EXTENDED,
    },
    cookie:{
        domain : process.env.COOKIE_DOMAIN,
        secure : process.env.COOKIE_SECURE
    },
    cors:{
        origin : process.env.CORS_ORIGIN
    },
    google:{
        client_id : process.env.GOOGLE_CLIENT_ID,
        client_secret : process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri : process.env.GOOGLE_REDIRECT_URI
    },
    smtp: {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
        secure: process.env.SMTP_SECURE === "true",
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        senderName: process.env.SMTP_SENDER_NAME || "MyApp Team",
      },
    logLevel: process.env.LOG_LEVEL
};

export default config;