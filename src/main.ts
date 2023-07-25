import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 5050;
  app.enableCors({
    origin: [
      'https://filezillow.com',
      'https://staging.filezillow.com',
      'http://localhost:8910',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
bootstrap();
