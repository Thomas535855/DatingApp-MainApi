import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";

// Load the environment variables
if (process.platform === "win32" || process.env.NODE_ENV === "development") {
    dotenv.config({ path: "./.env.development" });
} else {
    dotenv.config(); // Default loads .env
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
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PATCH, PUT, DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", ALLOWED_HEADERS);
    if (req.method === "OPTIONS") {
        res.sendStatus(200).end();
        return;
    }
    next();
});

// Load routes after initializing DB
import userRouter from "./routes/user";
import matchRouter from "./routes/match";

app.use("/user", userRouter);
app.use("/match", matchRouter);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.all('*', (req, res) => {
    res.status(404).json({ status: 'error', message: "We could not find what you're looking for!" });
});


// Export `app` for testing purposes
export { app };
