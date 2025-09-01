import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

const corsMiddleware = (app) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://full-stack-mern-simple-crud-operati-two.vercel.app/",
    /\.vercel\.app$/,
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (
          !origin ||
          allowedOrigins.some((pattern) =>
            typeof pattern === "string"
              ? origin === pattern
              : pattern.test(origin)
          )
        ) {
          callback(null, true);
        } else {
          console.error(`Blocked by CORS: ${origin}`);
          callback(new Error("Not allowed"));
        }
      },
      credentials: true,
    })
  );
};

export default corsMiddleware;
