import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.TCP_HOST || 'localhost', 
        port: parseInt(process.env.TCP_PORT || '3003'),    
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe()); 
  await app.listen();
  console.log('Cart microservice is listening on port 3003');
}
bootstrap();
