import { Exclude } from "class-transformer";
import { Colmeia } from "./colmeia.entity.js";

export class Apiario {
  id: string | undefined;
  nome: string;
  localizacao: string;
  quantidadeColmeias: number;
  dataFundacao: Date;

  @Exclude()
  colmeias: Colmeia[];

  operacional: boolean;

  constructor(
    id: string | undefined,
    nome: string,
    localizacao: string,
    quantidadeColmeias: number,
    dataFundacao: Date,
    colmeias: Colmeia[] = [],
    operacional: boolean = true,
  ) {
    this.id = id;
    this.nome = nome;
    this.localizacao = localizacao;
    this.quantidadeColmeias = quantidadeColmeias;
    this.dataFundacao = dataFundacao;
    this.colmeias = colmeias;
    this.operacional = operacional;
  }
}
