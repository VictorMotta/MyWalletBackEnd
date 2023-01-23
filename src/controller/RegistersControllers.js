import { ObjectId } from "mongodb";
import db from "../config/database.js";

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

export async function updateRegister(req, res) {
    const { idRegister } = req.params;
    const { description, value, type } = req.body;
    const checkUser = res.locals.session;

    const checkIdExist = await db.collection("registers").findOne({ _id: ObjectId(idRegister) });

    if (String(checkIdExist.idUser) !== String(checkUser.idUser)) {
        return res.sendStatus(401);
    }

    try {
        const result = await db
            .collection("registers")
            .updateOne({ _id: ObjectId(idRegister) }, { $set: { description, value, type } });

        if (result.modifiedCount === 0) return res.status(404).send("Esse registro não existe!");

        res.send("Registro Atualizado!");
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function deleteRegister(req, res) {
    const { idRegister } = req.params;
    const checkUser = res.locals.session;

    const checkIdExist = await db.collection("registers").findOne({ _id: ObjectId(idRegister) });

    if (!checkIdExist) {
        return res.sendStatus(404);
    }
    if (String(checkIdExist.idUser) !== String(checkUser.idUser)) {
        return res.sendStatus(401);
    }

    try {
        await db.collection("registers").deleteOne({ _id: ObjectId(idRegister) });

        res.send("Deletado com sucesso!");
    } catch (error) {
        res.status(500).send(error);
    }
}
