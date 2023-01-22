import db from "../config/database.js";
import { sendRegistersSchema } from "../schemas/RegistersSchemas.js";
import dayjs from "dayjs";

export async function getRegisters(req, res) {
    const checkUser = res.locals.session;

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
    const { description, value, type } = req.body;
    const checkUser = res.locals.session;

    try {
        const date = new Date();
        await db
            .collection("registers")
            .insertOne({ description, value, type, date, idUser: checkUser.idUser });

        return res.sendStatus(201);
    } catch (error) {
        console.log(error.message);
        return res.sendStatus(500);
    }
}
