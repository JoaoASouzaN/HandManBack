import { IFornecedor, Fornecedor } from '../../models/fornecedor/Fornecedor';
import { typeFornecedor } from '../../types/fornecedorType';
import { ServicoModel } from '../../models/servicoAgendado/Servico';
import { Usuario } from '../../models/usuario/Usuario';
import fs from 'fs/promises';
import path from 'path';

const fornecedoresPath = path.join(process.cwd(), 'banco/handMan.fornecedores.json');

export class FornecedorRepository {
  private model = Fornecedor.getInstance().getModel();
  private servicoModel = ServicoModel;
  private usuarioModel = Usuario.getInstance().getModel();

  // Método auxiliar para ler dados do JSON
  private async readFornecedoresFromFile(): Promise<any[]> {
    try {
      console.log('Tentando ler arquivo de fornecedores:', fornecedoresPath);
      const data = await fs.readFile(fornecedoresPath, 'utf-8');
      const fornecedores = JSON.parse(data);
      console.log('Fornecedores lidos:', fornecedores.length);
      return fornecedores;
    } catch (error) {
      console.error('Erro ao ler arquivo de fornecedores:', error);
      return [];
    }
  }

  // Método auxiliar para escrever dados no JSON
  private async writeFornecedoresToFile(fornecedores: any[]): Promise<void> {
    try {
      await fs.writeFile(fornecedoresPath, JSON.stringify(fornecedores, null, 2));
    } catch (error) {
      console.error('Erro ao escrever arquivo de fornecedores:', error);
      throw error;
    }
  }

  public async criarFornecedor(
    fornecedor: typeFornecedor
  ): Promise<IFornecedor> {
    try {
      // Para compatibilidade, também salvar no MongoDB se estiver disponível
      try {
        const fornecedorSalvar = new this.model(fornecedor);
        return await fornecedorSalvar.save();
      } catch (mongoError) {
        console.log('MongoDB não disponível, salvando apenas em JSON');
      }

      // Salvar no arquivo JSON
      const fornecedores = await this.readFornecedoresFromFile();
      const novoFornecedor = {
        _id: fornecedor.id_fornecedor,
        ...fornecedor
      };
      fornecedores.push(novoFornecedor);
      await this.writeFornecedoresToFile(fornecedores);
      
      return novoFornecedor as IFornecedor;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao criar fornecedor: ${error.message}`);
      } else {
        throw new Error("Erro desconhecido ao criar fornecedor");
      }
    }
  }

  public async buscarFornecedores() {
    try {
      console.log('Iniciando busca de fornecedores...');
      
      // Tentar buscar do MongoDB primeiro
      try {
        const fornecedores = await this.model.find();
        if (fornecedores && fornecedores.length > 0) {
          console.log('Fornecedores encontrados no MongoDB:', fornecedores.length);
          return fornecedores;
        }
      } catch (mongoError) {
        console.log('MongoDB não disponível, buscando do JSON');
      }

      // Se MongoDB falhar ou não tiver dados, buscar do JSON
      const fornecedores = await this.readFornecedoresFromFile();
      console.log('Fornecedores do JSON:', fornecedores.length);
      
      const fornecedoresFormatados = fornecedores.map(f => ({
        ...f,
        id_fornecedor: f._id
      }));
      
      console.log('Fornecedores formatados:', fornecedoresFormatados.length);
      return fornecedoresFormatados;
    } catch (error: unknown) {
      console.error('Erro em buscarFornecedores:', error);
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar fornecedores: ${error.message}`);
      } else {
        throw new Error("Erro desconhecido ao buscar fornecedores");
      }
    }
  }

  public async buscarFornecedorPorId(id: string) {
    try {
      // Tentar buscar do MongoDB primeiro
      try {
        const fornecedor = await this.model.findOne({ id_fornecedor: id });
        if (fornecedor) return fornecedor;
      } catch (mongoError) {
        console.log('MongoDB não disponível, buscando do JSON');
      }

      // Se MongoDB falhar, buscar do JSON
      const fornecedores = await this.readFornecedoresFromFile();
      const fornecedor = fornecedores.find(f => f._id === id);
      if (fornecedor) {
        return {
          ...fornecedor,
          id_fornecedor: fornecedor._id
        };
      }
      return null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar fornecedor: ${error.message}`);
      } else {
        throw new Error("Erro desconhecido ao buscar fornecedor");
      }
    }
  }

  public async buscarFornecedoresPorCategoria(categoria_servico: string) {
    try {
      // Tentar buscar do MongoDB primeiro
      try {
        const fornecedores = await this.model.find({ categoria_servico: categoria_servico });
        if (fornecedores.length > 0) return fornecedores;
      } catch (mongoError) {
        console.log('MongoDB não disponível, buscando do JSON');
      }

      // Se MongoDB falhar, buscar do JSON
      const fornecedores = await this.readFornecedoresFromFile();
      const fornecedoresFiltrados = fornecedores.filter(f => 
        f.categoria_servico && f.categoria_servico.includes(categoria_servico)
      );
      return fornecedoresFiltrados.map(f => ({
        ...f,
        id_fornecedor: f._id
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error ao buscar fornecedores:${error.message}`)
      } else {
        throw new Error("Erro desconhecido ao buscar fornecedores");
      }
    }
  }

  public async buscarFornecedoresPorTermo(categoria_servico: string, termo: string) {
    try {
      // Tentar buscar do MongoDB primeiro
      try {
        const termoRegex = new RegExp(termo, 'i');
        const fornecedores = await this.model.find({
          $or: [
            { categoria_servico: termoRegex },
            { nome: termoRegex },
            { descricao: termoRegex },
            { sub_descricao: termoRegex }
          ]
        });
        if (fornecedores.length > 0) return fornecedores;
      } catch (mongoError) {
        console.log('MongoDB não disponível, buscando do JSON');
      }

      // Se MongoDB falhar, buscar do JSON
      const fornecedores = await this.readFornecedoresFromFile();
      const termoLower = termo.toLowerCase();
      const fornecedoresFiltrados = fornecedores.filter(f => 
        f.nome?.toLowerCase().includes(termoLower) ||
        f.descricao?.toLowerCase().includes(termoLower) ||
        f.sub_descricao?.toLowerCase().includes(termoLower)
      );
      return fornecedoresFiltrados.map(f => ({
        ...f,
        id_fornecedor: f._id
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar fornecedores: ${error.message}`);
      } else {
        throw new Error("Erro desconhecido ao buscar fornecedores");
      }
    }
  }

  public async buscarFornecedorPorEmail(email: string) {
    try {
      // Tentar buscar do MongoDB primeiro
      try {
        const fornecedor = await this.model.findOne({ email });
        if (fornecedor) return fornecedor;
      } catch (mongoError) {
        console.log('MongoDB não disponível, buscando do JSON');
      }

      // Se MongoDB falhar, buscar do JSON
      const fornecedores = await this.readFornecedoresFromFile();
      const fornecedor = fornecedores.find(f => f.email === email);
      if (fornecedor) {
        return {
          ...fornecedor,
          id_fornecedor: fornecedor._id
        };
      }
      return null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar fornecedor: ${error.message}`);
      } else {
        throw new Error("Erro desconhecido ao buscar fornecedor");
      }
    }
  }

  public async atualizarFornecedor(id: string, dados: Partial<typeFornecedor>) {
    try {
      return await this.model.findOneAndUpdate({ id_fornecedor: id }, dados, {
        new: true,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao atualizar fornecedor: ${error.message}`);
      } else {
        throw new Error("Erro desconhecido ao atualizar fornecedor");
      }
    }
  }

  public async deletarFornecedor(id: string) {
    try {
      return await this.model.findOneAndDelete({ id_fornecedor: id });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao deletar fornecedor: ${error.message}`);
      } else {
        throw new Error("Erro desconhecido ao deletar fornecedor");
      }
    }
  }

  public async adicionarSolicitacao(id: string, idSolicitacao: string) {
    try {
      return await this.model.findOneAndUpdate(
        { id_fornecedor: id },
        { $push: { solicitacoes: idSolicitacao } },
        { new: true }
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao adicionar solicitação: ${error.message}`);
      } else {
        throw new Error("Erro desconhecido ao adicionar solicitação");
      }
    }
  }

  public async atualizarDisponibilidade(id: string, disponibilidade: any) {
    try {
      return await this.model.findOneAndUpdate(
        { id_fornecedor: id },
        { $push: { disponibilidade } },
        { new: true }
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao atualizar disponibilidade: ${error.message}`);
      } else {
        throw new Error("Erro desconhecido ao atualizar disponibilidade");
      }
    }
  }

  public async adicionarImagensServico(id: string, idImagemServico: string) {
    try {
      return await this.model.findOneAndUpdate(
        { id_fornecedor: id },
        { $push: { imagemServicos: idImagemServico } },
        { new: true }
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao adicionar solicitação: ${error.message}`);
      } else {
        throw new Error("Erro desconhecido ao adicionar solicitação");
      }
    }
  }

  public async atualizarMediaAvaliacoes(id: string, media: number) {
    try {
      return await this.model.findOneAndUpdate(
        { id_fornecedor: id },
        { media_avaliacoes: media },
        { new: true }
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Erro ao atualizar média de avaliações: ${error.message}`
        );
      } else {
        throw new Error("Erro desconhecido ao atualizar média de avaliações");
      }
    }
  }

  public async buscarSolicitacoesPorIdFornecedor(id_fornecedor: string) {
    try {
      // Buscar todos os serviços do fornecedor
      const servicos = await this.servicoModel.find({ id_fornecedor });

      // Para cada serviço, buscar os dados do usuário
      const servicosComUsuario = await Promise.all(
        servicos.map(async (servico) => {
          const usuario = await this.usuarioModel.findOne({ 
            id_usuario: servico.id_usuario 
          });

          return {
            servico: {
              id_servico: servico.id_servico,
              categoria: servico.categoria,
              data: servico.data,
              horario: servico.horario,
              status: servico.status,
              data_submisao:servico.data_submisao,
              descricao: servico.descricao,
              id_pagamento: servico.id_pagamento,
              id_avaliacao: servico.id_avaliacao
            },
            usuario: usuario ? {
              id_usuario: usuario.id_usuario,
              nome: usuario.nome,
              email: usuario.email,
              telefone: usuario.telefone,
              picture: usuario.picture
            } : null
          };
        })
      );

      return servicosComUsuario;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar solicitações: ${error.message}`);
      } else {
        throw new Error("Erro desconhecido ao buscar solicitações");
      }
    }
  }
}
