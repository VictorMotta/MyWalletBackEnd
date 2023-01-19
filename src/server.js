import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from "joi";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
dotenv.config();

const PORT = 5000;
const server = express();
const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try {
    await mongoClient.connect();
    db = mongoClient.db();
    console.log("MongoDB Connected!");
} catch (err) {
    console.log(err.message);
}

server.use(cors());
server.use(express.json());

server.post("/sign-up", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    const registerUserSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).max(36).required(),
        confirmPassword: joi.any().valid(joi.ref("password")).required(),
    });

    const validation = registerUserSchema.validate(
        { name, email, password, confirmPassword },
        { abortEarly: false }
    );

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const passwordEncrypt = bcrypt.hashSync(password, 10);

        await db.collection("users").insertOne({
            name,
            email,
            password: passwordEncrypt,
        });
        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

server.post("/sign-in", async (req, res) => {
    const { email, password } = req.body;

    const loginSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    });

    const validation = loginSchema.validate({ email, password }, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const user = await db.collection("users").findOne({ email });
        console.log(user);

        if (user && bcrypt.compareSync(password, user.password)) {
            const tokenExist = await db.collection("sessions").findOne({ idUser: user._id });

            if (!tokenExist) {
                const token = uuid();
                await db.collection("sessions").insertOne({ idUser: user._id, token });
                return res.send(token);
            }

            return res.send(tokenExist.token);
        } else {
            res.status(404).send("Usuário não encontrado!!");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

server.listen(PORT, console.log(`Servidor iniciado com sucesso! Na porta: ${PORT}`));
