import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ColheitaRepository } from "../../../domain/ports/colheita.repository.js";
import { ColheitaMel } from "../entities/colheita-mel.db-entity.js";

@Injectable()
export class TypeOrmColheitaRepository implements ColheitaRepository {
  constructor(
    @InjectRepository(ColheitaMel)
    private readonly repository: Repository<ColheitaMel>,
  ) {}

  async save(colheita: any): Promise<any> {
    const colheitaDB = this.repository.create(colheita);
    return await this.repository.save(colheitaDB);
  }

  async findAll(): Promise<any[]> {
    return this.repository.find({
      relations: ["apiario"],
      order: { dataColheita: "DESC" },
    });
  }

  async findByApiario(apiarioId: string): Promise<any[]> {
    return this.repository.find({
      where: { apiario: { id: apiarioId } },
      relations: ["apiario"],
      order: { dataColheita: "DESC" },
    });
  }

  async findById(id: number): Promise<any | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["apiario"],
    });
  }

  async update(id: number, data: any): Promise<any> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
