import { BadRequestException } from "@nestjs/common";

export class ValidatorUtils {
  static readonly REGEX_DATA_BR = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  /**
   * Valida se uma string está no formato DD/MM/YYYY
   */
  static validateDateFormat(dateStr: string, fieldName: string = "Data"): void {
    if (!this.REGEX_DATA_BR.test(dateStr)) {
      throw new BadRequestException(
        `${fieldName} deve estar no formato DD/MM/YYYY.`,
      );
    }
  }

  /**
   * Converte uma string DD/MM/YYYY em um objeto Date
   */
  static parseBrDate(dateStr: string): Date {
    const [dia, mes, ano] = dateStr.split("/").map(Number);
    return new Date(ano, mes - 1, dia);
  }

  /**
   * Formata uma Date (ou string de data) no padrão DD/MM/YYYY
   */
  static formatBrDate(date: Date | string): string {
    const d = date instanceof Date ? date : new Date(date);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  /**
   * Valida se uma data não é no futuro
   */
  static validateNotFutureDate(date: Date, fieldName: string = "Data"): void {
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);
    if (date > hoje) {
      throw new BadRequestException(`${fieldName} não pode ser no futuro.`);
    }
  }

  /**
   * Valida a regra de viabilidade econômica (mínimo de colmeias)
   */
  static validateMinColmeias(quantidade: number): void {
    if (quantidade < 5) {
      throw new BadRequestException(
        "Um apiário deve ter pelo menos 5 colmeias para ser considerado viável economicamente.",
      );
    }
  }
}
