import {
  Controller,
  Post,
  Get,
  Put,
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
import { AddColheitaUseCase } from "../../application/use-cases/add-colheita.use-case.js";
import { GetAllColheitasUseCase } from "../../application/use-cases/get-all-colheitas.use-case.js";
import { GetColheitasByApiarioUseCase } from "../../application/use-cases/get-colheitas-by-apiario.use-case.js";
import { GetColheitaByIdUseCase } from "../../application/use-cases/get-colheita-by-id.use-case.js";
import { UpdateColheitaUseCase } from "../../application/use-cases/update-colheita.use-case.js";
import { DeleteColheitaUseCase } from "../../application/use-cases/delete-colheita.use-case.js";
import { CreateColheitaDto } from "../dtos/create-colheita.dto.js";
import { UpdateColheitaDto } from "../dtos/update-colheita.dto.js";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard.js";

@ApiTags("apicultura")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("colheitas")
export class ColheitaController {
  constructor(
    private readonly addColheitaUseCase: AddColheitaUseCase,
    private readonly getAllColheitasUseCase: GetAllColheitasUseCase,
    private readonly getColheitasByApiarioUseCase: GetColheitasByApiarioUseCase,
    private readonly getColheitaByIdUseCase: GetColheitaByIdUseCase,
    private readonly updateColheitaUseCase: UpdateColheitaUseCase,
    private readonly deleteColheitaUseCase: DeleteColheitaUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: "Lista todas as colheitas registradas" })
  @ApiResponse({
    status: 200,
    description: "Lista de colheitas retornada com sucesso.",
  })
  async findAll() {
    return this.getAllColheitasUseCase.execute();
  }

  @Get("apiario/:apiarioId")
  @ApiOperation({ summary: "Lista as colheitas de um apiário específico" })
  @ApiParam({ name: "apiarioId", description: "ID do apiário (UUID)" })
  @ApiResponse({
    status: 200,
    description: "Lista de colheitas do apiário retornada com sucesso.",
  })
  async findByApiario(@Param("apiarioId") apiarioId: string) {
    return this.getColheitasByApiarioUseCase.execute(apiarioId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtém uma colheita por ID" })
  @ApiParam({ name: "id", description: "ID da colheita" })
  @ApiResponse({ status: 200, description: "Colheita encontrada." })
  @ApiResponse({ status: 404, description: "Colheita não encontrada." })
  async findById(@Param("id") id: string) {
    return this.getColheitaByIdUseCase.execute(Number(id));
  }

  @Put(":id")
  @ApiOperation({
    summary: "Atualiza uma colheita (revalida as regras de negócio)",
  })
  @ApiParam({ name: "id", description: "ID da colheita" })
  @ApiBody({ type: UpdateColheitaDto })
  @ApiResponse({ status: 200, description: "Colheita atualizada com sucesso." })
  async update(@Param("id") id: string, @Body() dto: UpdateColheitaDto) {
    return this.updateColheitaUseCase.execute(Number(id), dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove uma colheita" })
  @ApiParam({ name: "id", description: "ID da colheita" })
  @ApiResponse({ status: 200, description: "Colheita removida com sucesso." })
  async delete(@Param("id") id: string) {
    return this.deleteColheitaUseCase.execute(Number(id));
  }

  @Post(":apiarioId")
  @ApiOperation({ summary: "Adiciona uma colheita de mel a um apiário" })
  @ApiParam({ name: "apiarioId", description: "ID do apiário (UUID)" })
  @ApiBody({ type: CreateColheitaDto })
  @ApiResponse({ status: 201, description: "Colheita registrada com sucesso." })
  async add(
    @Param("apiarioId") apiarioId: string,
    @Body() createColheitaDto: CreateColheitaDto,
  ) {
    return this.addColheitaUseCase.execute(apiarioId, createColheitaDto);
  }
}
