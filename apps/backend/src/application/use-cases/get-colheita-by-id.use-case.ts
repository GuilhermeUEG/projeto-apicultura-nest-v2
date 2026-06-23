import { Injectable, NotFoundException } from "@nestjs/common";
import { ColheitaRepository } from "../../domain/ports/colheita.repository.js";

@Injectable()
export class GetColheitaByIdUseCase {
  constructor(private readonly repository: ColheitaRepository) {}

  async execute(id: number): Promise<any> {
    const colheita = await this.repository.findById(id);
    if (!colheita) {
      throw new NotFoundException("Colheita não encontrada.");
    }
    return colheita;
  }
}
