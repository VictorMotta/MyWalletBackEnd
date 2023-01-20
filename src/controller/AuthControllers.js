import { registerUserSchema, loginSchema } from "../schemas/AuthSchemas.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import db from "../config/database.js";

export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    const validation = registerUserSchema.validate(
        { name, email, password, confirmPassword },
        { abortEarly: false }
    );

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const checkUserExist = await db.collection("users").findOne({ email });

        if (checkUserExist) {
            return res.status(401).send("Usuário já existe! Tente fazer login!");
        }

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
}

export async function signIn(req, res) {
    const { email, password } = req.body;

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
}

export async function logoutUser(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    try {
        const checkUser = await db.collection("sessions").findOne({ token });

        if (!checkUser) {
            return res.sendStatus(403);
        }

        await db.collection("sessions").deleteOne({ token });

        return res.send(200);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}
