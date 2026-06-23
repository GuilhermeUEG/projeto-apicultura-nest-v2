import { Injectable } from "@nestjs/common";
import { ColmeiaRepository } from "../../domain/ports/colmeia.repository";

@Injectable()
export class GetColmeiasByApiarioUseCase {
  constructor(private readonly repository: ColmeiaRepository) {}

  async execute(apiarioId: string): Promise<any[]> {
    return this.repository.findByApiario(apiarioId);
  }
}
