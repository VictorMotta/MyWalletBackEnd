import express from "express";
import cors from "cors";
import AuthRouter from "./routes/AuthRoutes.js";
import registerRouter from "./routes/RegistersRoutes.js";

const PORT = 5000;
const server = express();

server.use(cors());
server.use(express.json());

server.use(AuthRouter);
server.use(registerRouter);

server.listen(PORT, console.log(`Servidor iniciado com sucesso! Na porta: ${PORT}`));
