import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ApiarioDBEntity } from "./apiario.db-entity.js";

@Entity("colheitas")
export class ColheitaMel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipoFlorada: string;

  @Column({ type: "datetime" })
  dataColheita: Date;

  @Column()
  purezaAlta: boolean;

  @Column("float")
  volumeLitros: number;

  @ManyToOne(() => ApiarioDBEntity, (apiario) => apiario.colheitas, {
    onDelete: "CASCADE",
  })
  apiario: ApiarioDBEntity;
}
