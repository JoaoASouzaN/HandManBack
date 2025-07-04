import { Leilao } from "../../models/leilao/Leilao";
import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

const dbPath = path.join(process.cwd(), "banco/handMan.leiloes.json");

console.log("CAMINHO DO JSON:", dbPath);

export class LeilaoRepository {
  async getAll(): Promise<Leilao[]> {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  }

  async getById(id: string): Promise<Leilao | undefined> {
    const leiloes = await this.getAll();
    return leiloes.find((l) => l.id === id);
  }

  async save(leilao: Omit<Leilao, "id">): Promise<Leilao> {
    const leiloes = await this.getAll();
    const novo: Leilao = { ...leilao, id: uuid() };
    leiloes.push(novo);
    await fs.writeFile(dbPath, JSON.stringify(leiloes, null, 2));
    return novo;
  }

  async addLance(leilaoId: string, lance: { usuarioId: string; valor: number }): Promise<Leilao | undefined> {
    const leiloes = await this.getAll();
    const index = leiloes.findIndex((l) => l.id === leilaoId);
    if (index === -1) return undefined;

    const novoLance = { ...lance, data: new Date().toISOString() };
    leiloes[index].lances.push(novoLance);

    await fs.writeFile(dbPath, JSON.stringify(leiloes, null, 2));
    return leiloes[index];
  }

  async deleteById(id: string): Promise<void> {
    const leiloes = await this.getAll();
    const novosLeiloes = leiloes.filter(l => l.id !== id);
    await fs.writeFile(dbPath, JSON.stringify(novosLeiloes, null, 2));
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const leiloes = await this.getAll();
    const index = leiloes.findIndex(l => l.id === id);
    if (index !== -1) {
      leiloes[index].status = status;
      await fs.writeFile(dbPath, JSON.stringify(leiloes, null, 2));
    }
  }
}