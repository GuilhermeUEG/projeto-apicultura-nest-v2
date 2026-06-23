import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsDateString,
} from "class-validator";

export class CreateColheitaDto {
  @ApiProperty({ example: "Silvestre" })
  @IsString()
  @IsNotEmpty()
  tipoFlorada: string;

  @ApiProperty({ example: "15/04/2026" })
  @IsString()
  @IsNotEmpty()
  dataColheita: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  purezaAlta: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  volumeLitros: number;
}
