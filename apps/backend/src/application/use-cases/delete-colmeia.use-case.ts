import { Injectable, NotFoundException } from "@nestjs/common";
import { ColmeiaRepository } from "../../domain/ports/colmeia.repository.js";

@Injectable()
export class DeleteColmeiaUseCase {
  constructor(private readonly repository: ColmeiaRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException("Colmeia não encontrada.");
    }

    await this.repository.delete(id);
  }
}
