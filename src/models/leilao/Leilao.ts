export interface Lance {
  usuarioId: string;
  valor: number;
  data: string;
}

export interface Leilao {
  id: string;
  titulo: string;
  descricao: string;
  valorDesejado: number;
  detalhes: string;
  prazoLimite: string;
  lances: Lance[];
}