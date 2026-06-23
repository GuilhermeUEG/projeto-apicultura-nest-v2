import { Injectable } from "@nestjs/common";
import { ColheitaRepository } from "../../domain/ports/colheita.repository.js";

@Injectable()
export class GetAllColheitasUseCase {
  constructor(private readonly repository: ColheitaRepository) {}

  async execute(): Promise<any[]> {
    return this.repository.findAll();
  }
}
