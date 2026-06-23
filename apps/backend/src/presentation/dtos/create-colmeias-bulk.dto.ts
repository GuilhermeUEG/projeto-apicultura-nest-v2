import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
} from "class-validator";

export class CreateColmeiasBulkDto {
  @ApiProperty({
    example: 5,
    description: "Quantidade de colmeias a criar (1 a 100).",
  })
  @IsInt()
  @Min(1)
  @Max(100)
  quantidade: number;

  @ApiProperty({
    example: "Langstroth",
    description: "Tipo aplicado a todas as colmeias criadas.",
  })
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @ApiProperty({
    example: "CLM",
    required: false,
    description:
      "Prefixo usado para gerar os códigos sequenciais (padrão: CLM).",
  })
  @IsOptional()
  @IsString()
  codigoBase?: string;
}
