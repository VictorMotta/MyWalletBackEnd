import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const PORT = 5000;
const app = express();
const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try {
    await mongoClient.connect();
    db = mongoClient.db();
    console.log("MongoDB Connected!");
} catch (err) {
    console.log(err.message);
}

app.use(cors());
app.use(express.json());

app.listen(PORT, console.log(`Servidor iniciado com sucesso! Na porta: ${PORT}`));
