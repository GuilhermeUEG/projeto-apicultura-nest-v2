import { Injectable, NotFoundException } from "@nestjs/common";
import { ApiarioRepository } from "../../domain/ports/apiario.repository.js";

@Injectable()
export class DeleteApiarioUseCase {
  constructor(private readonly repository: ApiarioRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException("Apiário não encontrado.");
    }

    await this.repository.delete(id);
  }
}
