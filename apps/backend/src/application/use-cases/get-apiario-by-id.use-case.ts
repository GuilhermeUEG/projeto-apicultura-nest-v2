import { Injectable, NotFoundException } from "@nestjs/common";
import { ApiarioRepository } from "../../domain/ports/apiario.repository.js";

@Injectable()
export class GetApiarioByIdUseCase {
  constructor(private readonly repository: ApiarioRepository) {}

  async execute(id: string): Promise<any> {
    const apiario = await this.repository.findById(id);
    if (!apiario) {
      throw new NotFoundException("Apiário não encontrado.");
    }
    return apiario;
  }
}
