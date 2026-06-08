import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'CHAVE_SECRETA_DO_MVP_DELIVERY', // secret deve ficar no arquivo .env
      signOptions: { expiresIn: '12h' }, // O login expira em 12 horas
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}