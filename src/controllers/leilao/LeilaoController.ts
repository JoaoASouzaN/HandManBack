import { Request, Response } from "express";
import { LeilaoService } from "../../service/leilao/LeilaoService";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

const service = new LeilaoService();

export class LeilaoController {
  buscarTodos(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>): void | Promise<void> {
      throw new Error("Method not implemented.");
  }
  async listar(req: Request, res: Response) {
    const dados = await service.listarLeiloes();
    res.json(dados);
  }

  async buscarPorId(req: Request, res: Response) {
    const { id } = req.params;
    const leilao = await service.buscarPorId(id);
    if (!leilao) return res.status(404).json({ erro: "Leilão não encontrado" });
    res.json(leilao);
  }

  async criar(req: Request, res: Response) {
    const { titulo, descricao, valorDesejado, detalhes, prazoLimite } = req.body;
    const novo = await service.criarLeilao({ titulo, descricao, valorDesejado, detalhes, prazoLimite });
    res.status(201).json(novo);
  }

  async lancar(req: Request, res: Response) {
    const { id } = req.params;
    const { usuarioId, valor } = req.body;
    const atualizado = await service.adicionarLance(id, usuarioId, valor);
    if (!atualizado) return res.status(404).json({ erro: "Leilão não encontrado para lançar" });
    res.json(atualizado);
  }
}
