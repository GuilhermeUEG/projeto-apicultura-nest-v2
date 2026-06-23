import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ColheitaMel } from "./colheita-mel.db-entity.js";
import { ColmeiaDBEntity } from "./colmeia.db-entity.js";

@Entity("apiarios")
export class ApiarioDBEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  nome: string;

  @Column()
  localizacao: string;

  @Column({ default: 0 })
  quantidadeColmeias: number;

  @Column({ type: "datetime" })
  dataFundacao: Date;

  @Column({ default: true })
  operacional: boolean;

  @OneToMany(() => ColheitaMel, (colheita) => colheita.apiario, {
    cascade: true,
  })
  colheitas: ColheitaMel[];

  @OneToMany(() => ColmeiaDBEntity, (colmeia) => colmeia.apiario)
  colmeias: ColmeiaDBEntity[];
}
