import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class UpdateColmeiaDto {
  @ApiProperty({ example: "CLM-001", required: false })
  @IsString()
  @IsOptional()
  codigo?: string;

  @ApiProperty({ example: "Langsroth", required: false })
  @IsString()
  @IsOptional()
  tipo?: string;

  @ApiProperty({ example: "uuid-do-apiario", required: false })
  @IsString()
  @IsOptional()
  apiarioId?: string;
}
