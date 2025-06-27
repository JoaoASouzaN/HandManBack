import express from "express";
import { LeilaoController } from "../../controllers/leilao/LeilaoController";

const LeilaoRouter = express.Router();
const controller = new LeilaoController();

// Rota para criar novo leilão
LeilaoRouter.post("/", (req, res) => controller.criar(req, res));

// Rota para listar todos os leilões
LeilaoRouter.get("/", (req, res) => controller.buscarTodos(req, res));

// Rota para buscar um leilão por ID
LeilaoRouter.get("/:id", (req, res) => controller.buscarPorId(req, res));

// Rota para lançar um novo lance em um leilão
LeilaoRouter.post("/:id/lances", (req, res) => controller.lancar(req, res));

export default LeilaoRouter;