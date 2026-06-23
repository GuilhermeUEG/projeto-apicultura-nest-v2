export abstract class ColmeiaRepository {
  abstract save(colmeia: any): Promise<any>;

  abstract findByApiario(apiarioId: string): Promise<any[]>;
  abstract findById(id: string): Promise<any | null>;
  abstract update(id: string, colmeia: any): Promise<any>;
  abstract delete(id: string): Promise<void>;
}
