import { NestFactory, Reflector } from "@nestjs/core";
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  BadRequestException,
} from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";
import { AllExceptionsFilter } from "./infrastructure/rest-api/filters/http-exception.filter.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ["http://localhost:4200"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce(
          (acc, err) => {
            const messages = Object.values(err.constraints || {});
            acc[err.property] =
              messages.length > 0 ? messages[0] : "Campo inválido";
            return acc;
          },
          {} as Record<string, string>,
        );
        return new BadRequestException({
          message: "Erro de validação nos campos informados.",
          errors: formattedErrors,
        });
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle("Gerenciamento de Apicultura")
    .setDescription("API para controle de apiários e colmeias")
    .setVersion("1.0")
    .addTag("apicultura")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger-ui", app, document);

  await app.listen(3000);
}
bootstrap();
