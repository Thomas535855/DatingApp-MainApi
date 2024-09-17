import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";

// Load the environment variables
if (process.platform === "win32" || process.env.NODE_ENV === "development") {
  dotenv.config({ path: "./.env.development" });
} else {
  dotenv.config();  // Default loads .env
}

const app = express();

// Middleware for JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS settings
const ALLOWED_HEADERS = [
  "Accept",
  "Origin",
  "Content-Type",
  "Access-Control-Allow-Headers",
  "Authorization",
  "X-Requested-With"
].join(", ");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PATCH, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", ALLOWED_HEADERS);
  if (req.method === "OPTIONS") {
    res.sendStatus(200).end();
    return;
  }
  next();
});

// Initialize the database connection
await AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized successfully.");

      // Start the server after database initialization
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((error) => {
      console.error("Error during Data Source initialization:", error);
    });

// Load routes after initializing DB
import userRouter from "./routes/user";
app.use("/user", userRouter);
