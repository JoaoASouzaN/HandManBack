import express from 'express';
import { ServicoController } from '../../controllers/servicoAgendado/ServicoController';
import { upload } from '../../config/multerConfig';

export const servicoRouter = express.Router();

const servicoController = new ServicoController();

servicoRouter.post('/', servicoController.criarServico);
servicoRouter.get('/:idServico', servicoController.buscarServico);
servicoRouter.get('/:idServico/usuario', servicoController.buscarServicoComUsuario);
servicoRouter.get('/usuario/:id', servicoController.buscarServicosPorUsuario);
servicoRouter.put('/', servicoController.atualizarStatus);
servicoRouter.put('/valor', servicoController.atualizarValorServico);
servicoRouter.post('/:id_servico/imagem', servicoController.inserirImagem);
servicoRouter.post('/verificar-conflitos', servicoController.verificarConflitosHorario);

servicoRouter.post('/',servicoController.criarServico);
servicoRouter.put('/',servicoController.atualizarStatus);
servicoRouter.get('/:idServico',servicoController.buscarServico);
servicoRouter.get('/:idServico/usuario',servicoController.buscarServicoComUsuario);
servicoRouter.post('/inserir-imagems/:id_servico',upload.single("imagem"),servicoController.inserirImagem);