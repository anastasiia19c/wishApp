import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: '*'
  });

  // Récupérer Reflector depuis le container
  const reflector = app.get(Reflector);

  // Appliquer JwtAuthGuard globalement
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
