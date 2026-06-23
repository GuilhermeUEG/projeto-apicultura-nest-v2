import { Injectable } from "@nestjs/common";
import { ApiarioRepository } from "../../domain/ports/apiario.repository";
import { Apiario } from "../../domain/entities/apiario.entity";

@Injectable()
export class GetAllApiariosUseCase {
  constructor(private readonly repository: ApiarioRepository) {}

  async execute(): Promise<Apiario[]> {
    return this.repository.findAll();
  }
}
