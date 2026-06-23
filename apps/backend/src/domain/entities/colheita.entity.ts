import { Apiario } from "./apiario.entity.js";

export class Colheita {
  id: string | undefined;
  tipoFlorada: string;
  dataColheita: Date;
  purezaAlta: boolean;
  volumeLitros: number;
  apiario: Apiario;

  constructor(
    id: string | undefined,
    tipoFlorada: string,
    dataColheita: Date,
    purezaAlta: boolean,
    volumeLitros: number,
    apiario: Apiario,
  ) {
    this.id = id;
    this.tipoFlorada = tipoFlorada;
    this.dataColheita = dataColheita;
    this.purezaAlta = purezaAlta;
    this.volumeLitros = volumeLitros;
    this.apiario = apiario;
  }
}
