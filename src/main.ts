import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";

import productRouter from "./routes/product";
import authRouter from "./routes/auth";

const app = express();
dotenv.config({ path: __dirname + "../.env" });

app.use(cors());
app.use(helmet());
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/product", productRouter);
app.use("/user", authRouter);

const PORT = process.env.PORT || 5000;
const MONGO_URI: string = process.env.MONGO_URI as string;
console.log(MONGO_URI);
console.log(process.env.PORT);
console.log(process.env.MONGO_URI as string);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`[server] server running at port ${PORT}`)
    );
  })
  .catch((error) => console.log(error));
