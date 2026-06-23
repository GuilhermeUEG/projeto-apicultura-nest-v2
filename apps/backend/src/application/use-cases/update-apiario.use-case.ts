import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ApiarioRepository } from "../../domain/ports/apiario.repository.js";
import { UpdateApiarioDto } from "../../presentation/dtos/update-apiario.dto.js";
import { ValidatorUtils } from "../../domain/utils/validator.utils.js";

@Injectable()
export class UpdateApiarioUseCase {
  constructor(private readonly repository: ApiarioRepository) {}

  async execute(id: string, dto: UpdateApiarioDto): Promise<any> {
    const apiario = await this.repository.findById(id);

    if (!apiario) {
      throw new NotFoundException("Apiário não encontrado.");
    }

    let dataFundacao: Date | undefined;
    if (dto.dataFundacao) {
      ValidatorUtils.validateDateFormat(dto.dataFundacao, "Data de fundação");
      dataFundacao = ValidatorUtils.parseBrDate(dto.dataFundacao);
      ValidatorUtils.validateNotFutureDate(dataFundacao, "Data de fundação");
    }

    if (dto.quantidadeColmeias !== undefined) {
      ValidatorUtils.validateMinColmeias(dto.quantidadeColmeias);
    }

    const updatedData = {
      ...apiario,
      ...dto,
      ...(dataFundacao ? { dataFundacao } : {}),
    };

    return this.repository.save(updatedData);
  }
}
