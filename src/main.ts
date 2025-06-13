import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ApiModule } from './api/api.module';
import { AllExceptionsFilter } from '@infrastructure/filters/exception.filter';

@Module({ imports: [ InfrastructureModule, ApiModule ]})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api-docs', app, document);

  app.useGlobalFilters(new AllExceptionsFilter())
  app.setGlobalPrefix("");
  app.enableCors({
    origin: '*', // Allow all origins
  });
  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
