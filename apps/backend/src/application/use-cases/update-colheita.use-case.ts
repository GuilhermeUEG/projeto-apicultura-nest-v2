import { Injectable, NotFoundException } from "@nestjs/common";
import { ColheitaRepository } from "../../domain/ports/colheita.repository.js";
import { ColmeiaRepository } from "../../domain/ports/colmeia.repository.js";
import { UpdateColheitaDto } from "../../presentation/dtos/update-colheita.dto.js";
import { validateColheita } from "../validators/validate-colheita.js";

@Injectable()
export class UpdateColheitaUseCase {
  constructor(
    private readonly repoColheita: ColheitaRepository,
    private readonly repoColmeia: ColmeiaRepository,
  ) {}

  async execute(id: number, dto: UpdateColheitaDto): Promise<any> {
    const colheita = await this.repoColheita.findById(id);
    if (!colheita) {
      throw new NotFoundException("Colheita não encontrada.");
    }

    const apiario = colheita.apiario;
    const colmeiasCadastradas = await this.repoColmeia.findByApiario(
      apiario.id,
    );

    const dataColheita = validateColheita({
      tipoFlorada: dto.tipoFlorada,
      dataColheita: dto.dataColheita,
      purezaAlta: dto.purezaAlta,
      volumeLitros: dto.volumeLitros,
      apiarioOperacional: apiario.operacional,
      numColmeias: colmeiasCadastradas.length,
      apiarioDataFundacao: apiario.dataFundacao,
    });

    return this.repoColheita.update(id, {
      tipoFlorada: dto.tipoFlorada,
      dataColheita,
      purezaAlta: dto.purezaAlta,
      volumeLitros: dto.volumeLitros,
    });
  }
}
