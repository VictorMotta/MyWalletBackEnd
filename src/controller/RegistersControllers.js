import db from "../config/database.js";
import { sendRegistersSchema } from "../schemas/RegistersSchemas.js";
import dayjs from "dayjs";

export async function getRegisters(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    const checkUser = await db.collection("sessions").findOne({ token });

    if (!checkUser) {
        return res.sendStatus(401);
    }

    try {
        const registersUser = await db
            .collection("registers")
            .find({ idUser: checkUser.idUser })
            .toArray();

        return res.send(registersUser);
    } catch (error) {
        console.log(error.message);
        return res.sendStatus(500);
    }
}

export async function sendRegisters(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const { description, value, type } = req.body;
    const date = new Date();

    const checkUser = await db.collection("sessions").findOne({ token });

    if (!checkUser) {
        return res.sendStatus(401);
    }

    const validation = sendRegistersSchema.validate(
        { description, value, type },
        { abortEarly: false }
    );

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        await db
            .collection("registers")
            .insertOne({ description, value, type, date, idUser: checkUser.idUser });

        return res.sendStatus(201);
    } catch (error) {
        console.log(error.message);
        return res.sendStatus(500);
    }
}
