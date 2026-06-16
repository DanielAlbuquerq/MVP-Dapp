import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Para garantir que o Nest.js bloqueie requisições 
// com e-mails inválidos ou senhas fracas antes mesmo 
// de chegarem às nossas rotas, ative o ValidationPipe globalmente.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
 // Ativa a validação baseada em DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Converte os dados brutos para os tipos do DTO
      whitelist: true, // Remove propriedades que não estão no DTO (segurança)
    })
  );

  // Habilita CORS para o nosso front-end conseguir fazer requisições
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
