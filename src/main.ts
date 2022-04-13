import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import compress from 'fastify-compress';
import helmet from 'fastify-helmet';

import { AllExceptionFilter } from './common/filters';
import { ConfigMode, ConfigService } from './config';

import { AppModule } from './app.module';

/**
 * [description]
 */
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const configService = app.get(ConfigService);

  const allExceptionFilter = new AllExceptionFilter();
  const validationPipe = new ValidationPipe({
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });
  app.useGlobalPipes(validationPipe).useGlobalFilters(allExceptionFilter);

  await app.register(compress, { encodings: ['gzip', 'deflate'] });
  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  app.setGlobalPrefix(configService.get('PREFIX')).enableCors({
    credentials: configService.get('CORS_CREDENTIALS'),
    origin: configService.get('CORS_ORIGIN'),
  });

  if (configService.getMode(ConfigMode.production)) app.enableShutdownHooks();
  if (configService.get('SWAGGER_MODULE')) {
    const config = new DocumentBuilder()
      .setVersion(configService.get('npm_package_version'))
      .setTitle(configService.get('npm_package_name'))
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);
  }

  if (configService.get('IS_HEROKU_WEB')) {
    return app.listen(configService.get('PORT'), configService.get('HOST'));
  }
}

bootstrap();
