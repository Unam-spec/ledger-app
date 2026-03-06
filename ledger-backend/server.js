import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use("/api/auth", authRoutes);

// eslint-disable-next-line no-undef
connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"));

// Routes
// eslint-disable-next-line no-undef
app.use("/api/auth", require("./routes/auth"));
// eslint-disable-next-line no-undef
app.use("/api/expenses", require("./routes/expenses"));
// eslint-disable-next-line no-undef
app.use("/api/budgets", require("./routes/budgets"));
// eslint-disable-next-line no-undef
app.use("/api/accounts", require("./routes/accounts"));

app.listen(5000, () => console.log("Server on port 5000"));
