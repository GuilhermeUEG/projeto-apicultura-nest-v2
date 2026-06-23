import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { ApiarioDBEntity } from "./infrastructure/adapters/entities/apiario.db-entity.js";
import { ColmeiaDBEntity } from "./infrastructure/adapters/entities/colmeia.db-entity.js";
import { ColheitaMel } from "./infrastructure/adapters/entities/colheita-mel.db-entity.js";
import { User } from "./users/entities/user.entity.js";

import { ApiarioRepository } from "./domain/ports/apiario.repository.js";
import { TypeOrmApiarioRepository } from "./infrastructure/adapters/repositories/typeorm-apiario.repository.js";
import { ColmeiaRepository } from "./domain/ports/colmeia.repository.js";
import { TypeOrmColmeiaRepository } from "./infrastructure/adapters/repositories/typeorm-colmeia.repository.js";
import { ColheitaRepository } from "./domain/ports/colheita.repository.js";
import { TypeOrmColheitaRepository } from "./infrastructure/adapters/repositories/typeorm-colheita.repository.js";

import { CreateApiarioUseCase } from "./application/use-cases/create-apiario.use-case.js";
import { GetAllApiariosUseCase } from "./application/use-cases/get-all-apiarios.use-case.js";
import { DeleteApiarioUseCase } from "./application/use-cases/delete-apiario.use-case.js";
import { AddColmeiaUseCase } from "./application/use-cases/add-colmeia.use-case.js";
import { AddColmeiasBulkUseCase } from "./application/use-cases/add-colmeias-bulk.use-case.js";
import { GetColmeiasByApiarioUseCase } from "./application/use-cases/get-colmeias-by-apiario.use-case.js";
import { GetColmeiaByIdUseCase } from "./application/use-cases/get-colmeia-by-id.use-case.js";
import { UpdateColmeiaUseCase } from "./application/use-cases/update-colmeia.use-case.js";
import { DeleteColmeiaUseCase } from "./application/use-cases/delete-colmeia.use-case.js";
import { AddColheitaUseCase } from "./application/use-cases/add-colheita.use-case.js";
import { GetAllColheitasUseCase } from "./application/use-cases/get-all-colheitas.use-case.js";
import { GetColheitasByApiarioUseCase } from "./application/use-cases/get-colheitas-by-apiario.use-case.js";
import { GetColheitaByIdUseCase } from "./application/use-cases/get-colheita-by-id.use-case.js";
import { UpdateColheitaUseCase } from "./application/use-cases/update-colheita.use-case.js";
import { DeleteColheitaUseCase } from "./application/use-cases/delete-colheita.use-case.js";
import { UpdateApiarioUseCase } from "./application/use-cases/update-apiario.use-case.js";
import { GetApiarioByIdUseCase } from "./application/use-cases/get-apiario-by-id.use-case.js";

import { ApiarioController } from "./presentation/controllers/apiario.controller.js";
import { ColmeiaController } from "./presentation/controllers/colmeia.controller.js";
import { ColheitaController } from "./presentation/controllers/colheita.controller.js";

import { UsersModule } from "./users/users.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { MailerModule } from "./mailer/mailer.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "sqlite",
        database:
          configService.get<string>("DATABASE_NAME") || "apicultura.sqlite",
        entities: [ApiarioDBEntity, ColmeiaDBEntity, ColheitaMel, User],
        // synchronize: true é aceitável neste projeto educacional; em produção
        // deve ser substituído por migrations.
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([ApiarioDBEntity, ColmeiaDBEntity, ColheitaMel]),
    UsersModule,
    AuthModule,
    MailerModule,
  ],
  controllers: [ApiarioController, ColmeiaController, ColheitaController],
  providers: [
    {
      provide: ApiarioRepository,
      useClass: TypeOrmApiarioRepository,
    },
    {
      provide: ColmeiaRepository,
      useClass: TypeOrmColmeiaRepository,
    },
    {
      provide: ColheitaRepository,
      useClass: TypeOrmColheitaRepository,
    },
    CreateApiarioUseCase,
    GetAllApiariosUseCase,
    GetApiarioByIdUseCase,
    DeleteApiarioUseCase,
    AddColmeiaUseCase,
    AddColmeiasBulkUseCase,
    GetColmeiasByApiarioUseCase,
    GetColmeiaByIdUseCase,
    UpdateColmeiaUseCase,
    DeleteColmeiaUseCase,
    AddColheitaUseCase,
    GetAllColheitasUseCase,
    GetColheitasByApiarioUseCase,
    GetColheitaByIdUseCase,
    UpdateColheitaUseCase,
    DeleteColheitaUseCase,
    UpdateApiarioUseCase,
  ],
})
export class AppModule {}
