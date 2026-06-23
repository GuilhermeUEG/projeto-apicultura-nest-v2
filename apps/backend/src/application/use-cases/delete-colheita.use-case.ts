import { Injectable, NotFoundException } from "@nestjs/common";
import { ColheitaRepository } from "../../domain/ports/colheita.repository.js";

@Injectable()
export class DeleteColheitaUseCase {
  constructor(private readonly repository: ColheitaRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException("Colheita não encontrada.");
    }
    await this.repository.delete(id);
  }
}
