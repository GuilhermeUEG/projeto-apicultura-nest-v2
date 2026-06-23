import { Injectable, BadRequestException } from "@nestjs/common";
import { ApiarioRepository } from "../../domain/ports/apiario.repository.js";
import { ValidatorUtils } from "../../domain/utils/validator.utils.js";

@Injectable()
export class CreateApiarioUseCase {
  constructor(private readonly repository: ApiarioRepository) {}

  async execute(data: any): Promise<any> {
    if (
      !data.nome ||
      !data.localizacao ||
      data.quantidadeColmeias === undefined ||
      !data.dataFundacao
    ) {
      throw new BadRequestException(
        "Todos os campos de Apiário devem ser preenchidos.",
      );
    }

    ValidatorUtils.validateDateFormat(data.dataFundacao, "Data de fundação");
    const dataFundacao = ValidatorUtils.parseBrDate(data.dataFundacao);
    ValidatorUtils.validateNotFutureDate(dataFundacao, "Data de fundação");
    ValidatorUtils.validateMinColmeias(data.quantidadeColmeias);

    return this.repository.save({
      ...data,
      dataFundacao: dataFundacao,
    });
  }
}
