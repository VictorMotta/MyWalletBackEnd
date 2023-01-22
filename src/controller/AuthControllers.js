import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import db from "../config/database.js";

export async function signUp(req, res) {
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
    const token = uuid();

    try {
        const user = await db.collection("users").findOne({ email });
        console.log(user);

        if (user && bcrypt.compareSync(password, user.password)) {
            const tokenExist = await db.collection("sessions").findOne({ idUser: user._id });

            if (!tokenExist) {
                console.log("entrou token não existe");

                await db.collection("sessions").insertOne({ idUser: user._id, token });

                const bodyTokenNoExist = {
                    ...user,
                    token: token,
                };
                delete bodyTokenNoExist.password;
                return res.send(bodyTokenNoExist);
            }
            console.log("entrou token existe");
            const bodyTokenExist = {
                ...user,
                token: tokenExist.token,
            };
            delete bodyTokenExist.password;

            return res.send(bodyTokenExist);
        } else {
            res.status(404).send("E-mail ou senha incorreta!!");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function logoutUser(req, res) {
    const checkUser = res.locals.session;

    try {
        await db.collection("sessions").deleteOne({ token: checkUser.token });

        return res.send(200);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}
