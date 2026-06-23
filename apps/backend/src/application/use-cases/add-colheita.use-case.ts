import { Injectable, NotFoundException } from "@nestjs/common";
import { ApiarioRepository } from "../../domain/ports/apiario.repository.js";
import { ColheitaRepository } from "../../domain/ports/colheita.repository.js";
import { ColmeiaRepository } from "../../domain/ports/colmeia.repository.js";
import { CreateColheitaDto } from "../../presentation/dtos/create-colheita.dto.js";
import { validateColheita } from "../validators/validate-colheita.js";

@Injectable()
export class AddColheitaUseCase {
  constructor(
    private readonly repoApiario: ApiarioRepository,
    private readonly repoColheita: ColheitaRepository,
    private readonly repoColmeia: ColmeiaRepository,
  ) {}

  async execute(apiarioId: string, dto: CreateColheitaDto) {
    const apiario = await this.repoApiario.findById(apiarioId);
    if (!apiario) {
      throw new NotFoundException("Apiário não encontrado.");
    }

    const colmeiasCadastradas = await this.repoColmeia.findByApiario(apiarioId);

    const dataColheita = validateColheita({
      tipoFlorada: dto.tipoFlorada,
      dataColheita: dto.dataColheita,
      purezaAlta: dto.purezaAlta,
      volumeLitros: dto.volumeLitros,
      apiarioOperacional: apiario.operacional,
      numColmeias: colmeiasCadastradas.length,
      apiarioDataFundacao: apiario.dataFundacao,
    });

    const novaColheita = {
      ...dto,
      dataColheita,
      apiario,
    };

    return await this.repoColheita.save(novaColheita);
  }
}
