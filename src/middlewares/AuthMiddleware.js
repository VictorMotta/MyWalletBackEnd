import db from "../config/database.js";

export const authValidation = async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.status(422).send("Informe o token!");

    try {
        const checkUser = await db.collection("sessions").findOne({ token });

        if (!checkUser) {
            return res.status(401).send("Você não tem autorização!");
        }

        res.locals.session = checkUser;

        next();
    } catch (error) {
        res.status(500).send(error);
    }
};
