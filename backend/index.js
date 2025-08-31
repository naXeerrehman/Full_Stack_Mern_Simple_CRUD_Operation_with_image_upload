import express, { urlencoded } from "express";
import ConnectDB from "./DatabaseConnection.js";
import corsMiddleware from "./Middlewares/cors.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const PORT = 5000;

corsMiddleware(app);
ConnectDB();

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`✅ App Is Running On PORT:${PORT}`);
});
