import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Permite usar o Prisma em qualquer lugar do app
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Essencial para que os outros módulos acessem o banco
})
export class PrismaModule {}