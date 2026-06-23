import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateColmeiaDto {
  @ApiProperty({ example: "CLM-001" })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({ example: "Langstroth" })
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @ApiPropertyOptional({ example: "uuid-do-apiario" })
  @IsString()
  @IsOptional()
  apiarioId?: string;
}
