import { Injectable } from "@nestjs/common";
import { ColheitaRepository } from "../../domain/ports/colheita.repository.js";

@Injectable()
export class GetColheitasByApiarioUseCase {
  constructor(private readonly repository: ColheitaRepository) {}

  async execute(apiarioId: string): Promise<any[]> {
    return this.repository.findByApiario(apiarioId);
  }
}
