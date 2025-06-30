import { Request, Response } from "express";
import { LeilaoService } from "../../service/leilao/LeilaoService";
import { getTokenData } from "../../middlewares/Authenticator";

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
      
      // Formatar os leilões para o formato esperado pelo mobile
      const leiloesFormatados = leiloes.map(leilao => ({
        id: leilao.id,
        titulo: leilao.titulo,
        descricao: leilao.descricao,
        valorDesejado: leilao.valorDesejado,
        detalhes: leilao.detalhes,
        prazoLimite: leilao.prazoLimite,
        categoria: "Serviços", // Campo padrão
        imagem: "", // Campo opcional
        imagemCapa: "", // Campo opcional
        lances: leilao.lances.map(lance => ({
          id: Math.random().toString(36).substr(2, 9),
          usuarioId: lance.usuarioId,
          valor: lance.valor,
          data: lance.data,
          nomeUsuario: `Usuário ${lance.usuarioId}` // Campo opcional
        }))
      }));
      
      res.json(leiloesFormatados);
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
      
      // Formata o leilão para o formato esperado pelo mobile
      const leilaoFormatado = {
        id: leilao.id,
        titulo: leilao.titulo,
        descricao: leilao.descricao,
        valorDesejado: leilao.valorDesejado,
        detalhes: leilao.detalhes,
        prazoLimite: leilao.prazoLimite,
        categoria: "Serviços", // Campo padrão
        imagem: "", // Campo opcional
        imagemCapa: "", // Campo opcional
        id_usuario: leilao.id_usuario || "user1", // Campo padrão
        lances: leilao.lances.map(lance => ({
          id: Math.random().toString(36).substr(2, 9),
          usuarioId: lance.usuarioId,
          valor: lance.valor,
          data: lance.data,
          nomeUsuario: `Usuário ${lance.usuarioId}` // Campo opcional
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
      // Verificar se o token está presente no header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ erro: "Token de autenticação não fornecido" });
        return;
      }

      // Extrair o token do header (formato: "Bearer <token>")
      const token = authHeader.replace('Bearer ', '');
      const tokenData = getTokenData(token);

      if (!tokenData) {
        res.status(401).json({ erro: "Token inválido" });
        return;
      }

      // Verificar se o usuário é um fornecedor
      if (tokenData.role !== 'Fornecedor') {
        res.status(403).json({ 
          erro: "Apenas fornecedores podem dar lances em leilões",
          detalhes: "Você precisa ser um fornecedor para participar de leilões"
        });
        return;
      }

      // Buscar o leilão para validar o valor
      const leilao = await leilaoService.buscarPorId(id);
      if (!leilao) {
        res.status(404).json({ erro: "Leilão não encontrado" });
        return;
      }

      // Verificar se o usuário está tentando dar lance em seu próprio leilão
      if (leilao.id_usuario === tokenData.id) {
        res.status(400).json({ 
          erro: "Você não pode dar lance em seu próprio leilão",
          detalhes: "O criador do leilão não pode participar dos lances"
        });
        return;
      }

      // Validar se o lance é menor que o valor desejado
      if (valor >= leilao.valorDesejado) {
        res.status(400).json({ 
          erro: "Lance inválido",
          detalhes: `O lance deve ser menor que R$ ${leilao.valorDesejado}. Você ofereceu R$ ${valor}`
        });
        return;
      }

      // Verificar se já existe um lance menor
      if (leilao.lances.length > 0) {
        const menorLance = Math.min(...leilao.lances.map(l => l.valor));
        if (valor >= menorLance) {
          res.status(400).json({ 
            erro: "Lance muito alto",
            detalhes: `Já existe um lance de R$ ${menorLance}. Seu lance deve ser menor.`
          });
          return;
        }
      }

      const resultado = await leilaoService.adicionarLance(id, tokenData.id, valor);
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
        id: leilao.id,
        titulo: leilao.titulo,
        descricao: leilao.descricao,
        valorDesejado: leilao.valorDesejado,
        detalhes: leilao.detalhes,
        prazoLimite: leilao.prazoLimite,
        categoria: "Serviços",
        valor_atual: leilao.lances.length > 0 ? leilao.lances[leilao.lances.length - 1].valor : leilao.valorDesejado,
        prazo: leilao.prazoLimite,
        status: new Date(leilao.prazoLimite) > new Date() ? 'Ativo' : 'Finalizado',
        total_lances: leilao.lances.length,
        lances: leilao.lances.map(lance => ({
          id: Math.random().toString(36).substr(2, 9),
          usuarioId: lance.usuarioId,
          valor: lance.valor,
          data: lance.data,
          nomeUsuario: `Usuário ${lance.usuarioId}`
        }))
      }));
      res.json(leiloesFormatados);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao buscar leilões do usuário", detalhes: error });
    }
  };
}
