import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AddColmeiaUseCase } from "../../application/use-cases/add-colmeia.use-case.js";
import { AddColmeiasBulkUseCase } from "../../application/use-cases/add-colmeias-bulk.use-case.js";
import { GetColmeiasByApiarioUseCase } from "../../application/use-cases/get-colmeias-by-apiario.use-case.js";
import { GetColmeiaByIdUseCase } from "../../application/use-cases/get-colmeia-by-id.use-case.js";
import { UpdateColmeiaUseCase } from "../../application/use-cases/update-colmeia.use-case.js";
import { DeleteColmeiaUseCase } from "../../application/use-cases/delete-colmeia.use-case.js";
import { CreateColmeiaDto } from "../dtos/create-colmeia.dto.js";
import { CreateColmeiasBulkDto } from "../dtos/create-colmeias-bulk.dto.js";
import { UpdateColmeiaDto } from "../dtos/update-colmeia.dto.js";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard.js";

@ApiTags("apicultura")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("colmeias")
export class ColmeiaController {
  constructor(
    private readonly addColmeiaUseCase: AddColmeiaUseCase,
    private readonly addColmeiasBulkUseCase: AddColmeiasBulkUseCase,
    private readonly getColmeiasByApiarioUseCase: GetColmeiasByApiarioUseCase,
    private readonly getColmeiaByIdUseCase: GetColmeiaByIdUseCase,
    private readonly updateColmeiaUseCase: UpdateColmeiaUseCase,
    private readonly deleteColmeiaUseCase: DeleteColmeiaUseCase,
  ) {}

  @Get(":id")
  @ApiOperation({ summary: "Obtém os detalhes de uma colmeia por ID" })
  @ApiParam({ name: "id", description: "ID da colmeia (UUID)" })
  @ApiResponse({
    status: 200,
    description: "Detalhes da colmeia retornados com sucesso.",
  })
  async findById(@Param("id") id: string) {
    return this.getColmeiaByIdUseCase.execute(id);
  }

  @Post(":apiarioId")
  @ApiOperation({ summary: "Adiciona uma colmeia a um apiário" })
  @ApiParam({ name: "apiarioId", description: "ID do apiário (UUID)" })
  @ApiBody({ type: CreateColmeiaDto })
  @ApiResponse({ status: 201, description: "Colmeia adicionada com sucesso." })
  async add(
    @Param("apiarioId") apiarioId: string,
    @Body() createColmeiaDto: CreateColmeiaDto,
  ) {
    return this.addColmeiaUseCase.execute(apiarioId, createColmeiaDto);
  }

  @Post(":apiarioId/bulk")
  @ApiOperation({
    summary:
      "Adiciona várias colmeias de uma vez a um apiário (cadastro em massa)",
  })
  @ApiParam({ name: "apiarioId", description: "ID do apiário (UUID)" })
  @ApiBody({ type: CreateColmeiasBulkDto })
  @ApiResponse({
    status: 201,
    description: "Colmeias adicionadas com sucesso.",
  })
  async addBulk(
    @Param("apiarioId") apiarioId: string,
    @Body() dto: CreateColmeiasBulkDto,
  ) {
    return this.addColmeiasBulkUseCase.execute(apiarioId, dto);
  }

  @Get("apiario/:apiarioId")
  @ApiOperation({ summary: "Lista todas as colmeias de um apiário" })
  @ApiParam({ name: "apiarioId", description: "ID do apiário" })
  @ApiResponse({
    status: 200,
    description: "Lista de colmeias retornada com sucesso.",
  })
  async findByApiario(@Param("apiarioId") apiarioId: string) {
    return this.getColmeiasByApiarioUseCase.execute(apiarioId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualiza os dados de uma colmeia" })
  @ApiParam({ name: "id", description: "ID da colmeia (UUID)" })
  @ApiBody({ type: UpdateColmeiaDto })
  @ApiResponse({ status: 200, description: "Colmeia atualizada com sucesso." })
  async update(
    @Param("id") id: string,
    @Body() updateColmeiaDto: UpdateColmeiaDto,
  ) {
    return this.updateColmeiaUseCase.execute(id, updateColmeiaDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove uma colmeia" })
  @ApiParam({ name: "id", description: "ID da colmeia (UUID)" })
  @ApiResponse({ status: 200, description: "Colmeia removida com sucesso." })
  async delete(@Param("id") id: string) {
    return this.deleteColmeiaUseCase.execute(id);
  }
}
