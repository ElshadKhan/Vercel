import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createApp } from './helpers/createApp';

async function bootstrap() {
  const rawApp = await NestFactory.create(AppModule);
  const app = createApp(rawApp);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
  });
}
bootstrap();
