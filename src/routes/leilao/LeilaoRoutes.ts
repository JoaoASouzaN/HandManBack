import express from 'express';
import { LeilaoController } from '../../controllers/leilao/LeilaoController';

const leilaoRouter = express.Router();
const leilaoController = new LeilaoController();

// Rotas públicas
leilaoRouter.get('/', leilaoController.listarLeiloes);
leilaoRouter.get('/ativos', leilaoController.listarLeiloesAtivos);
leilaoRouter.get('/:id', leilaoController.obterLeilaoPorId);

// Rotas protegidas
leilaoRouter.post('/', leilaoController.criarLeilao);
leilaoRouter.post('/:id/lance', leilaoController.enviarLance);
leilaoRouter.get('/usuario/:id_usuario', leilaoController.listarLeiloesPorUsuario);

export default leilaoRouter;
