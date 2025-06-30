import { ServicoRepository } from '../repositories/servicoAgendado/ServivoRepository';
import { LeilaoRepository } from '../repositories/leilao/LeilaoRepository';
import { CustomError } from './CustomError';

export interface ConflictInfo {
  hasConflict: boolean;
  conflictingServices: Array<{
    id: string;
    data: Date;
    horario: Date;
    tipo: 'servico' | 'leilao';
    titulo?: string;
  }>;
  message?: string;
}

export class NotificationService {
  private servicoRepository = new ServicoRepository();
  private leilaoRepository = new LeilaoRepository();

  /**
   * Verifica se há conflitos de horário para um fornecedor
   */
  public async verificarConflitosHorario(
    fornecedorId: string,
    novaData: Date,
    novoHorario: Date,
    servicoId?: string // ID do serviço sendo editado (para excluir da verificação)
  ): Promise<ConflictInfo> {
    try {
      const conflitos: ConflictInfo['conflictingServices'] = [];
      
      // Buscar serviços do fornecedor
      const servicos = await this.servicoRepository.buscarServicosPorFornecedorId(fornecedorId);
      
      // Buscar leilões do fornecedor (se implementado)
      // const leiloes = await this.leilaoRepository.buscarLeiloesPorFornecedorId(fornecedorId);
      
      // Verificar conflitos com serviços
      for (const servico of servicos) {
        if (servicoId && servico.id_servico === servicoId) {
          continue; // Pular o próprio serviço sendo editado
        }

        if (servico.status === 'cancelado') {
          continue; // Pular serviços cancelados
        }

        const conflito = this.verificarConflitoHorario(
          novaData,
          novoHorario,
          servico.data,
          servico.horario
        );

        if (conflito) {
          conflitos.push({
            id: servico.id_servico,
            data: servico.data,
            horario: servico.horario,
            tipo: 'servico',
            titulo: servico.descricao
          });
        }
      }

      // Verificar conflitos com leilões (implementar quando necessário)
      // for (const leilao of leiloes) {
      //   const conflito = this.verificarConflitoHorario(
      //     novaData,
      //     novoHorario,
      //     leilao.data,
      //     leilao.horario
      //   );
      //   if (conflito) {
      //     conflitos.push({
      //       id: leilao.id,
      //       data: leilao.data,
      //       horario: leilao.horario,
      //       tipo: 'leilao',
      //       titulo: leilao.titulo
      //     });
      //   }
      // }

      const hasConflict = conflitos.length > 0;
      
      let message = '';
      if (hasConflict) {
        const tipos = conflitos.map(c => c.tipo);
        const tiposUnicos = [...new Set(tipos)];
        
        if (tiposUnicos.length === 1 && tiposUnicos[0] === 'servico') {
          message = `Você já tem ${conflitos.length} serviço(s) agendado(s) neste horário.`;
        } else if (tiposUnicos.length === 1 && tiposUnicos[0] === 'leilao') {
          message = `Você já tem ${conflitos.length} leilão(ões) agendado(s) neste horário.`;
        } else {
          message = `Você já tem ${conflitos.length} compromisso(s) agendado(s) neste horário.`;
        }
      }

      return {
        hasConflict,
        conflictingServices: conflitos,
        message
      };

    } catch (error) {
      throw new CustomError('Erro ao verificar conflitos de horário', 500);
    }
  }

  /**
   * Verifica se dois horários conflitam
   */
  private verificarConflitoHorario(
    data1: Date,
    horario1: Date,
    data2: Date,
    horario2: Date
  ): boolean {
    // Verificar se é o mesmo dia
    const mesmoDia = data1.toDateString() === data2.toDateString();
    if (!mesmoDia) {
      return false;
    }

    // Converter horários para minutos para facilitar comparação
    const [inicio1, fim1] = this.parseHorarioDate(horario1);
    const [inicio2, fim2] = this.parseHorarioDate(horario2);

    // Verificar sobreposição
    // Um conflito ocorre se:
    // - O início de um está dentro do período do outro, OU
    // - O fim de um está dentro do período do outro, OU
    // - Um período engloba completamente o outro
    return (
      (inicio1 >= inicio2 && inicio1 < fim2) || // Início do novo dentro do existente
      (fim1 > inicio2 && fim1 <= fim2) || // Fim do novo dentro do existente
      (inicio1 <= inicio2 && fim1 >= fim2) // Novo engloba o existente
    );
  }

  /**
   * Converte horário Date para minutos
   */
  private parseHorarioDate(horario: Date): [number, number] {
    const hora = horario.getHours();
    const minuto = horario.getMinutes();
    
    // Assumindo que o horário representa o início do serviço
    // e que cada serviço dura 1 hora por padrão
    const inicioMinutos = hora * 60 + minuto;
    const fimMinutos = inicioMinutos + 60; // 1 hora de duração
    
    return [inicioMinutos, fimMinutos];
  }

  /**
   * Converte horário no formato "HH:MM-HH:MM" para minutos (para compatibilidade)
   */
  private parseHorario(horario: string): [number, number] {
    const [inicio, fim] = horario.split('-');
    const [horaInicio, minInicio] = inicio.split(':').map(Number);
    const [horaFim, minFim] = fim.split(':').map(Number);
    
    const inicioMinutos = horaInicio * 60 + minInicio;
    const fimMinutos = horaFim * 60 + minFim;
    
    return [inicioMinutos, fimMinutos];
  }

  /**
   * Gera mensagem de notificação para conflitos
   */
  public gerarMensagemConflito(conflictInfo: ConflictInfo): string {
    if (!conflictInfo.hasConflict) {
      return '';
    }

    const { conflictingServices } = conflictInfo;
    
    if (conflictingServices.length === 1) {
      const conflito = conflictingServices[0];
      return `⚠️ Conflito de horário detectado!\n\nVocê já tem um ${conflito.tipo} agendado neste horário:\n${conflito.titulo || 'Sem título'}\nData: ${conflito.data.toLocaleDateString('pt-BR')}\nHorário: ${conflito.horario.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `⚠️ Conflito de horário detectado!\n\nVocê já tem ${conflictingServices.length} compromissos agendados neste horário. Verifique sua agenda.`;
    }
  }
} 