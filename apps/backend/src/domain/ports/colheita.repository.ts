import { Colheita } from "../entities/colheita.entity.js";

export abstract class ColheitaRepository {
  abstract save(colheita: Partial<Colheita>): Promise<Colheita>;
  abstract findAll(): Promise<any[]>;
  abstract findByApiario(apiarioId: string): Promise<any[]>;
  abstract findById(id: number): Promise<any | null>;
  abstract update(id: number, data: any): Promise<any>;
  abstract delete(id: number): Promise<void>;
}
