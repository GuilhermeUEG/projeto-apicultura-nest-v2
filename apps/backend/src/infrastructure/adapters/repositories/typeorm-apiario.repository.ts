import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiarioRepository } from "../../../domain/ports/apiario.repository.js";
import { ApiarioDBEntity } from "../entities/apiario.db-entity.js";
import { Apiario } from "../../../domain/entities/apiario.entity.js";
import { Colmeia } from "../../../domain/entities/colmeia.entity.js";

@Injectable()
export class TypeOrmApiarioRepository implements ApiarioRepository {
  constructor(
    @InjectRepository(ApiarioDBEntity)
    private readonly repository: Repository<ApiarioDBEntity>,
  ) {}

  async save(apiario: Apiario): Promise<Apiario> {
    const apiarioDB = this.repository.create({
      id: apiario.id,
      nome: apiario.nome,
      localizacao: apiario.localizacao,
      quantidadeColmeias: apiario.quantidadeColmeias,
      dataFundacao: apiario.dataFundacao,
      operacional: apiario.operacional,
    });

    const savedApiario = await this.repository.save(apiarioDB);

    return new Apiario(
      savedApiario.id,
      savedApiario.nome,
      savedApiario.localizacao,
      savedApiario.quantidadeColmeias,
      savedApiario.dataFundacao,
      [],
      savedApiario.operacional,
    );
  }

  async findAll(): Promise<Apiario[]> {
    const apiariosDB = await this.repository.find({
      relations: ["colmeias"],
    });

    return apiariosDB.map((apiarioDB) => {
      return new Apiario(
        apiarioDB.id,
        apiarioDB.nome,
        apiarioDB.localizacao,
        apiarioDB.quantidadeColmeias,
        apiarioDB.dataFundacao,
        apiarioDB.colmeias?.map(
          (c) => new Colmeia(c.id, c.codigo, c.tipo, apiarioDB.id),
        ),
        apiarioDB.operacional,
      );
    });
  }

  async findById(id: number | string): Promise<Apiario | null> {
    const apiarioDB = await this.repository.findOne({
      where: { id } as any,
      relations: ["colmeias"],
    });

    if (!apiarioDB) return null;

    return new Apiario(
      apiarioDB.id,
      apiarioDB.nome,
      apiarioDB.localizacao,
      apiarioDB.quantidadeColmeias,
      apiarioDB.dataFundacao,
      apiarioDB.colmeias?.map(
        (c) => new Colmeia(c.id, c.codigo, c.tipo, apiarioDB.id),
      ),
      apiarioDB.operacional,
    );
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
