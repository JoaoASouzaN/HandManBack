import { Iservico } from "../../models/servicoAgendado/Servico";
import { FornecedorRepository } from "../../repositories/fornecedor/FornecedorRepository";
import { ServicoRepository } from "../../repositories/servicoAgendado/ServivoRepository";
import { UsuarioRepository } from "../../repositories/usuario/UsuarioRepository";
import { typeServico, ServicoComUsuario } from "../../types/servicoType";
import { BaseService } from "../BaseService";
import { CustomError } from "../CustomError";
import { NotificationService } from "../NotificationService";

export class ServicoService extends BaseService {
    private servicoRepository = new ServicoRepository();
    private fornecedorRepository = new FornecedorRepository();
    private usuarioRepository = new UsuarioRepository();
    private notificationService = new NotificationService();

    //Salva a soliçitação na tabela de serviços e também adiciona o id da tabela serviços ao fornecedor
    public async criarServico(servico:typeServico):Promise<Iservico>{
        try{
            this.validateRequiredFields(servico,['id_fornecedor','id_usuario','status','categoria','data','horario','descricao']);

            const fornecedorExiste = await this.fornecedorRepository.buscarFornecedorPorId(servico.id_fornecedor);

            if(!fornecedorExiste){
                throw new CustomError('Fornecedor não encontrado', 404);
            }
            
            const usuarioExiste = await this.usuarioRepository.buscarPorId(servico.id_usuario);

            if(!usuarioExiste){
                throw new CustomError('Usuário não encontrado',404);
            }

            // Verificar conflitos de horário
            const conflitos = await this.notificationService.verificarConflitosHorario(
                servico.id_fornecedor,
                servico.data,
                servico.horario
            );

            if (conflitos.hasConflict) {
                const mensagem = this.notificationService.gerarMensagemConflito(conflitos);
                throw new CustomError(mensagem, 409); // 409 Conflict
            }

            await this.fornecedorRepository.adicionarSolicitacao(servico.id_fornecedor,servico.id_servico);

            return await this.servicoRepository.criarServico(servico);

        }catch(error){
            this.handleError(error);
        }
    }

    public async atualizarStatus(id_servico:string,dadosAtualizados:Partial<typeServico>){
        try{
            const servico = await  this.servicoRepository.atualizarStatus(id_servico,dadosAtualizados);

            if(!servico){
                throw new CustomError('Servico não encontrado',404);
            }

            // Se estiver atualizando data ou horário, verificar conflitos
            if (dadosAtualizados.data || dadosAtualizados.horario) {
                const conflitos = await this.notificationService.verificarConflitosHorario(
                    servico.id_fornecedor,
                    dadosAtualizados.data || servico.data,
                    dadosAtualizados.horario || servico.horario,
                    id_servico // Excluir o próprio serviço da verificação
                );

                if (conflitos.hasConflict) {
                    const mensagem = this.notificationService.gerarMensagemConflito(conflitos);
                    throw new CustomError(mensagem, 409); // 409 Conflict
                }
            }

            return servico;
        }catch(error){
            this.handleError(error);
        }
    }

    public async buscarServico(idServico: string) {
        console.log('[ServicoService] Buscando serviço com id:', idServico);
        const servico = await this.servicoRepository.buscarServico(idServico);
        console.log('[ServicoService] Resultado da busca:', servico);
        return servico;
    }

    public async atualizarImagemServico(id_servico:string,imagems:string){
        try{
            await this.servicoRepository.atualizarImagemServico(id_servico,imagems);
        }catch(error){
            this.handleError(error);
        }
    }

    public async buscarServicoComUsuario(idServico: string): Promise<ServicoComUsuario | null> {
        try {
            const servico = await this.servicoRepository.buscarServicoComUsuario(idServico);
            return servico;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async atualizarValorServico(id_servico: string, valor: number): Promise<Iservico> {
        try {
            const servico = await this.servicoRepository.buscarServico(id_servico);
            
            if (!servico) {
                throw new CustomError('Serviço não encontrado', 404);
            }

            if (servico.status !== 'negociar valor') {
                throw new CustomError('Só é possível alterar o valor de serviços negociar valor', 400);
            }

            return await this.servicoRepository.atualizarValorServico(id_servico, valor);
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Verifica conflitos de horário para um fornecedor
     */
    public async verificarConflitosHorario(
        fornecedorId: string,
        data: Date,
        horario: Date,
        servicoId?: string
    ) {
        try {
            return await this.notificationService.verificarConflitosHorario(
                fornecedorId,
                data,
                horario,
                servicoId
            );
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Busca todos os serviços de um usuário específico
     */
    public async buscarServicosPorUsuarioId(idUsuario: string) {
        try {
            const servicos = await this.servicoRepository.buscarServicosPorUsuarioId(idUsuario);
            return servicos;
        } catch (error) {
            this.handleError(error);
        }
    }
}