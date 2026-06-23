import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { ValidatorUtils } from "../../domain/utils/validator.utils.js";

export const FLORADAS_PERMITIDAS = [
  "Silvestre",
  "Citros",
  "Eucalipto",
  "Flores Silvestres",
  "Acácia",
];

export interface ColheitaValidationInput {
  tipoFlorada: string;
  dataColheita: string;
  purezaAlta: boolean;
  volumeLitros: number;
  apiarioOperacional: boolean;
  numColmeias: number;
  apiarioDataFundacao: Date | string;
}

/**
 * Centraliza TODAS as regras de negócio de colheita da 1VA (compartilhadas entre
 * o cadastro e a edição). Retorna a data já convertida em Date quando válida.
 */
export function validateColheita(input: ColheitaValidationInput): Date {
  const {
    tipoFlorada,
    dataColheita,
    purezaAlta,
    volumeLitros,
    apiarioOperacional,
    numColmeias,
    apiarioDataFundacao,
  } = input;

  if (
    !tipoFlorada ||
    !dataColheita ||
    purezaAlta === undefined ||
    purezaAlta === null ||
    volumeLitros === undefined ||
    volumeLitros === null
  ) {
    throw new BadRequestException(
      "Todos os campos de ColheitaMel devem ser preenchidos.",
    );
  }

  if (!apiarioOperacional) {
    throw new ForbiddenException(
      "Não é permitido colher mel de um apiário desativado.",
    );
  }

  ValidatorUtils.validateDateFormat(dataColheita, "Data de colheita");
  const data = ValidatorUtils.parseBrDate(dataColheita);
  ValidatorUtils.validateNotFutureDate(data, "Data de colheita");

  const fundacao =
    apiarioDataFundacao instanceof Date
      ? apiarioDataFundacao
      : new Date(apiarioDataFundacao);
  if (!isNaN(fundacao.getTime())) {
    const diaColheita = Date.UTC(
      data.getFullYear(),
      data.getMonth(),
      data.getDate(),
    );
    const diaFundacao = Date.UTC(
      fundacao.getFullYear(),
      fundacao.getMonth(),
      fundacao.getDate(),
    );
    if (diaColheita < diaFundacao) {
      throw new BadRequestException(
        `A data da colheita não pode ser anterior à data de fundação do apiário (${ValidatorUtils.formatBrDate(fundacao)}).`,
      );
    }
  }

  if (numColmeias < 5) {
    throw new BadRequestException(
      `O apiário possui apenas ${numColmeias} colmeia(s) cadastrada(s). É necessário ter pelo menos 5 colmeias cadastradas para registrar uma colheita (viabilidade econômica).`,
    );
  }

  if (volumeLitros <= 0) {
    throw new BadRequestException(
      "O volume da colheita deve ser maior que zero litros.",
    );
  }

  const limiteMaximo = numColmeias * 1.5;
  if (volumeLitros > limiteMaximo) {
    throw new BadRequestException(
      `Volume de ${volumeLitros}L excede o limite realista de ${limiteMaximo}L para ${numColmeias} colmeias.`,
    );
  }

  if (purezaAlta === true && volumeLitros < 10) {
    throw new BadRequestException(
      "Mel de alta pureza deve ter um volume de pelo menos 10 litros.",
    );
  }
  if (purezaAlta === false && volumeLitros >= limiteMaximo * 0.8) {
    throw new BadRequestException(
      "Volume de mel comum deve ser inferior a 80% do limite máximo.",
    );
  }

  if (!FLORADAS_PERMITIDAS.includes(tipoFlorada)) {
    throw new BadRequestException(
      `Florada '${tipoFlorada}' inválida. Use: ${FLORADAS_PERMITIDAS.join(", ")}`,
    );
  }

  return data;
}
