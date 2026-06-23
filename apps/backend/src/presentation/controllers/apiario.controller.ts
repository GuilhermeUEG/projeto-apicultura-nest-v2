import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CreateApiarioUseCase } from "../../application/use-cases/create-apiario.use-case.js";
import { GetAllApiariosUseCase } from "../../application/use-cases/get-all-apiarios.use-case.js";
import { GetApiarioByIdUseCase } from "../../application/use-cases/get-apiario-by-id.use-case.js";
import { DeleteApiarioUseCase } from "../../application/use-cases/delete-apiario.use-case.js";
import { UpdateApiarioUseCase } from "../../application/use-cases/update-apiario.use-case.js";
import { CreateApiarioDto } from "../dtos/create-apiario.dto.js";
import { UpdateApiarioDto } from "../dtos/update-apiario.dto.js";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard.js";

@ApiTags("apicultura")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("apiarios")
export class ApiarioController {
  constructor(
    private readonly createApiarioUseCase: CreateApiarioUseCase,
    private readonly getAllApiariosUseCase: GetAllApiariosUseCase,
    private readonly getApiarioByIdUseCase: GetApiarioByIdUseCase,
    private readonly deleteApiarioUseCase: DeleteApiarioUseCase,
    private readonly updateApiarioUseCase: UpdateApiarioUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: "Cria um novo apiário" })
  @ApiResponse({ status: 201, description: "Apiário criado com sucesso." })
  async create(@Body() data: CreateApiarioDto) {
    return this.createApiarioUseCase.execute(data);
  }

  @Get()
  @ApiOperation({ summary: "Lista todos os apiários" })
  @ApiResponse({
    status: 200,
    description: "Lista de apiários retornada com sucesso.",
  })
  async findAll() {
    return this.getAllApiariosUseCase.execute();
  }

  @Get(":id")
  @ApiOperation({ summary: "Busca um apiário pelo ID" })
  @ApiParam({ name: "id", description: "ID do apiário (UUID)" })
  @ApiResponse({ status: 200, description: "Apiário encontrado." })
  @ApiResponse({ status: 404, description: "Apiário não encontrado." })
  async findOne(@Param("id") id: string) {
    return this.getApiarioByIdUseCase.execute(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Atualiza um apiário" })
  @ApiParam({ name: "id", description: "ID do apiário (UUID)" })
  @ApiResponse({ status: 200, description: "Apiário atualizado com sucesso." })
  async update(@Param("id") id: string, @Body() data: UpdateApiarioDto) {
    return this.updateApiarioUseCase.execute(id, data);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove um apiário" })
  @ApiParam({ name: "id", description: "ID do apiário (UUID)" })
  @ApiResponse({ status: 200, description: "Apiário removido com sucesso." })
  async delete(@Param("id") id: string) {
    return this.deleteApiarioUseCase.execute(id);
  }
}
