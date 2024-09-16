import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ALLOWED_HEADERS = [
  "Accept, ",
  "Origin, ",
  "Content-Type, ",
  "Access-Control-Allow-Headers, ",
  "Authorization, ",
  "X-Requested-With"
].join("");

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

import userRouter from "./routes/user";
app.use("/user", userRouter);
