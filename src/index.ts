import configDotEnv from "./config";
import express, { json } from "express";
import notFound from "./middleware/not_Found";
import { cardsRouter } from "./routes/cards";
import { usersRouter } from "./routes/users";
import { connect } from "./database/connection";
import { errorHandler } from "./middleware/error-handler";
import morgan from "morgan";
import cors from "cors";

configDotEnv();
connect();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5000/",
  })
);

app.use(express.static("public"));

app.use(json());

app.use(morgan("dev"));
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/cards", cardsRouter);
app.use(errorHandler);
app.use(notFound);

app.listen(5000);
