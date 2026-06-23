import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { ColmeiaRepository } from "../../domain/ports/colmeia.repository.js";
import { ApiarioRepository } from "../../domain/ports/apiario.repository.js";
import { CreateColmeiasBulkDto } from "../../presentation/dtos/create-colmeias-bulk.dto.js";
import { Colmeia } from "../../domain/entities/colmeia.entity.js";

@Injectable()
export class AddColmeiasBulkUseCase {
  constructor(
    private readonly colmeiaRepository: ColmeiaRepository,
    private readonly apiarioRepository: ApiarioRepository,
  ) {}

  async execute(
    apiarioId: string,
    dto: CreateColmeiasBulkDto,
  ): Promise<Colmeia[]> {
    const apiario = await this.apiarioRepository.findById(apiarioId);
    if (!apiario) {
      throw new NotFoundException("Apiário não encontrado.");
    }

    if (!apiario.operacional) {
      throw new ForbiddenException(
        "Não é permitido cadastrar colmeias em um apiário desativado.",
      );
    }

    const existentes = await this.colmeiaRepository.findByApiario(apiarioId);
    const codigosExistentes = new Set(existentes.map((c) => c.codigo));
    const base = (dto.codigoBase?.trim() || "CLM").toUpperCase();

    const criadas: Colmeia[] = [];
    let seq = 0;
    for (let i = 0; i < dto.quantidade; i++) {
      let codigo: string;
      do {
        seq++;
        codigo = `${base}-${String(seq).padStart(3, "0")}`;
      } while (codigosExistentes.has(codigo));
      codigosExistentes.add(codigo);

      const colmeia = new Colmeia(undefined, codigo, dto.tipo, apiarioId);
      criadas.push(await this.colmeiaRepository.save(colmeia));
    }

    return criadas;
  }
}
