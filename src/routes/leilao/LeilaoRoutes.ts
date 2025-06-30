import express from 'express';
import { LeilaoController } from '../../controllers/leilao/LeilaoController';

const leilaoRouter = express.Router();
const leilaoController = new LeilaoController();

// Rotas públicas
leilaoRouter.get('/', leilaoController.listarLeiloes);
leilaoRouter.get('/ativos', leilaoController.listarLeiloesAtivos);
leilaoRouter.get('/usuario/:id', leilaoController.listarLeiloesPorUsuario);
leilaoRouter.get('/:id', leilaoController.obterLeilaoPorId);

// Rotas protegidas
leilaoRouter.post('/', leilaoController.criarLeilao);
leilaoRouter.post('/:id/lance', leilaoController.enviarLance);
leilaoRouter.delete('/:id', leilaoController.deletarLeilao);
leilaoRouter.patch('/:id/cancelar', leilaoController.cancelarLeilao);

export default leilaoRouter;
