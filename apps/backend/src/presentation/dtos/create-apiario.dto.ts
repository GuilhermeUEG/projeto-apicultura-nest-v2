import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsBoolean,
  IsOptional,
} from "class-validator";

export class CreateApiarioDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  localizacao: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  quantidadeColmeias: number;

  @ApiProperty({ example: "25/05/2020" })
  @IsString()
  @IsNotEmpty()
  dataFundacao: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  operacional?: boolean;
}
