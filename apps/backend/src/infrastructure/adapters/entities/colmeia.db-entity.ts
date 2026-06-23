import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiarioDBEntity } from "./apiario.db-entity.js";

@Entity("colmeias")
export class ColmeiaDBEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  codigo: string;

  @Column()
  tipo: string;

  @Column()
  apiarioId: string;

  @ManyToOne(() => ApiarioDBEntity, (apiario) => apiario.colmeias, {
    onDelete: "CASCADE",
  })
  apiario: ApiarioDBEntity;
}
