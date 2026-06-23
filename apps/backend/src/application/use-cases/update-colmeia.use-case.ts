import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { ColmeiaRepository } from "../../domain/ports/colmeia.repository.js";
import { UpdateColmeiaDto } from "../../presentation/dtos/update-colmeia.dto.js";
import { Colmeia } from "../../domain/entities/colmeia.entity.js";

@Injectable()
export class UpdateColmeiaUseCase {
  constructor(private readonly repository: ColmeiaRepository) {}

  async execute(id: string, dto: UpdateColmeiaDto): Promise<Colmeia> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException("Colmeia não encontrada.");
    }

    if (dto.codigo && dto.codigo !== existing.codigo) {
      const irmas = await this.repository.findByApiario(existing.apiarioId);
      if (irmas.some((c) => c.id !== id && c.codigo === dto.codigo)) {
        throw new ConflictException(
          `Já existe uma colmeia com o código "${dto.codigo}" neste apiário.`,
        );
      }
    }

    return this.repository.update(id, dto);
  }
}
