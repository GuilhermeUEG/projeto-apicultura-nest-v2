export abstract class ApiarioRepository {
  abstract save(apiario: any): Promise<any>;
  abstract findAll(): Promise<any[]>;
  abstract findById(id: number | string): Promise<any | null>;
  abstract delete(id: string): Promise<void>;
}
