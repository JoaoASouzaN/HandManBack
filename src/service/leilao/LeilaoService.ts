import { Leilao } from "../../models/leilao/Leilao";
import { LeilaoRepository } from "../../repositories/leilao/LeilaoRepository";

export class LeilaoService {
  private repo = new LeilaoRepository();

  async listarLeiloes(): Promise<Leilao[]> {
    return this.repo.getAll();
  }

  async buscarPorId(id: string): Promise<Leilao | undefined> {
    return this.repo.getById(id);
  }

  async criarLeilao(leilao: Omit<Leilao, "id" | "lances">): Promise<Leilao> {
    return this.repo.save({ ...leilao, lances: [] });
  }

  async adicionarLance(leilaoId: string, usuarioId: string, valor: number): Promise<Leilao | undefined> {
    return this.repo.addLance(leilaoId, { usuarioId, valor });
  }

  async deletarLeilao(id: string): Promise<void> {
    await this.repo.deleteById(id);
  }

  async atualizarStatus(id: string, status: string): Promise<void> {
    await this.repo.updateStatus(id, status);
  }
}
