import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsInt, Min, IsBoolean, IsOptional } from "class-validator";

export class UpdateApiarioDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  localizacao?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsInt()
  @Min(0)
  @IsOptional()
  quantidadeColmeias?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  operacional?: boolean;

  @ApiPropertyOptional({ example: "25/05/2020" })
  @IsString()
  @IsOptional()
  dataFundacao?: string;
}
