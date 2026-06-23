import { Injectable, NotFoundException } from "@nestjs/common";
import { ColmeiaRepository } from "../../domain/ports/colmeia.repository.js";

@Injectable()
export class GetColmeiaByIdUseCase {
  constructor(private readonly repository: ColmeiaRepository) {}

  async execute(id: string): Promise<any> {
    const colmeia = await this.repository.findById(id);
    if (!colmeia) {
      throw new NotFoundException("Colmeia não encontrada.");
    }
    return colmeia;
  }
}
