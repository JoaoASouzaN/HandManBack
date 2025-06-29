import { Request, Response } from "express";
import { LeilaoService } from "../../service/leilao/LeilaoService";

const leilaoService = new LeilaoService();

export class LeilaoController {
  public criarLeilao = async (req: Request, res: Response): Promise<void> => {
    const { titulo, descricao, valorDesejado, detalhes, prazoLimite, id_usuario } = req.body;

    try {
      const leilao = await leilaoService.criarLeilao({
        titulo,
        descricao,
        valorDesejado,
        detalhes,
        prazoLimite,
        id_usuario,
      });
      res.status(201).json(leilao);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao criar leilão", detalhes: error });
    }
  };

  public listarLeiloes = async (req: Request, res: Response): Promise<void> => {
    try {
      const leiloes = await leilaoService.listarLeiloes();
      res.json(leiloes);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao listar leilões", detalhes: error });
    }
  };

  public listarLeiloesAtivos = async (req: Request, res: Response): Promise<void> => {
    try {
      const leiloes = await leilaoService.listarLeiloes();
      const agora = new Date();
      
      // Filtra leilões com prazo futuro e formata para o frontend
      const leiloesAtivos = leiloes
        .filter(leilao => new Date(leilao.prazoLimite) > agora)
        .map(leilao => ({
          id: leilao.id,
          titulo: leilao.titulo,
          descricao: leilao.descricao,
          imagemCapa: "", // Campo opcional para imagem
          tempoFinalizacao: leilao.prazoLimite
        }));
      
      res.json(leiloesAtivos);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao listar leilões ativos", detalhes: error });
    }
  };

  public obterLeilaoPorId = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const leilao = await leilaoService.buscarPorId(id);
      if (!leilao) {
        res.status(404).json({ erro: "Leilão não encontrado" });
        return;
      }
      
      // Formata o leilão para o formato esperado pelo frontend
      const leilaoFormatado = {
        id_leilao: leilao.id,
        titulo: leilao.titulo,
        descricao: leilao.descricao,
        categoria: "Serviços", // Campo padrão, pode ser expandido depois
        data_final: leilao.prazoLimite,
        id_usuario: "user1", // Campo padrão, pode ser expandido depois
        lances: leilao.lances.map(lance => ({
          id_lance: Math.random().toString(36).substr(2, 9), // ID temporário
          id_usuario: lance.usuarioId,
          valor: lance.valor,
          criado_em: lance.data
        }))
      };
      
      res.json(leilaoFormatado);
    } catch (error) {
      res.status(404).json({ erro: "Leilão não encontrado", detalhes: error });
    }
  };

  public enviarLance = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { usuarioId, valor } = req.body;

    try {
      const resultado = await leilaoService.adicionarLance(id, usuarioId, valor);
      res.json(resultado);
    } catch (error) {
      res.status(400).json({ erro: "Erro ao enviar lance", detalhes: error });
    }
  };

  public listarLeiloesPorUsuario = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const leiloes = await leilaoService.listarLeiloes();
      // Filtrar apenas leilões criados pelo usuário
      const leiloesDoUsuario = leiloes.filter(leilao => leilao.id_usuario === id);
      // Formatar para o frontend
      const leiloesFormatados = leiloesDoUsuario.map(leilao => ({
        id_leilao: leilao.id,
        titulo: leilao.titulo,
        valor_atual: leilao.lances.length > 0 ? leilao.lances[leilao.lances.length - 1].valor : leilao.valorDesejado,
        prazo: leilao.prazoLimite,
        status: new Date(leilao.prazoLimite) > new Date() ? 'Ativo' : 'Finalizado',
        total_lances: leilao.lances.length
      }));
      res.json(leiloesFormatados);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao buscar leilões do usuário", detalhes: error });
    }
  };
}
