# Guia de Implementação: Autenticação Completa (NestJS + Prisma + PostgreSQL)
Este guia contém toda a estrutura configurada com validação de e-mail (case-insensitive), hash de senhas com Bcrypt e o sistema de tokens inspirado no iFood (Access Token de 6 horas e Refresh Token de 7 dias com rota de logout).

---

## 1. Banco de Dados (Prisma Schema)
Configure o modelo de usuário para garantir e-mails únicos e armazenar o hash do refresh token.

```prisma
// prisma/schema.prisma
model User {
  id                 Int     @id @default(autoincrement())
  email              String  @unique
  password           String
  hashedRefreshToken String?
    
  @@index([email(ops: raw("text_ops"))])
}
```
*Execute no terminal:* `npx prisma migrate dev --name setup_auth_system`

---

## 2. Dependências Necessárias
Instale os pacotes de validação, criptografia e as estratégias do Passport.

```bash
npm i class-validator class-transformer bcrypt @nestjs/jwt @nestjs/passport passport passport-jwt
npm i -D @types/bcrypt @types/passport-jwt
```

---

## 3. Validação de Entrada (DTOs)
Crie as regras de validação para os dados enviados pelo cliente no registro e no login.

```typescript
// src/auth/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Por favor, insira um e-mail válido.' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'A senha deve conter no mínimo 8 caracteres.' })
  password: string;
}
```

---

## 4. Configuração Global (Main.ts)
Ative a validação global no arquivo de inicialização do NestJS.

```typescript
// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

---

## 5. Estratégias do Passport (JWT & Refresh Token)
Crie os arquivos responsáveis por interceptar e validar os tokens nas requisições.

### Access Token Strategy (6 horas)
```typescript
// src/auth/strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'JWT_ACCESS_SECRET', // Substitua por variavel de ambiente (.env)
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

### Refresh Token Strategy (7 dias)
```typescript
// src/auth/strategies/jwt-refresh.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'JWT_REFRESH_SECRET', // Substitua por variavel de ambiente (.env)
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { userId: payload.sub, email: payload.email, refreshToken };
  }
}
```

---

## 6. Guards de Autenticação
Encapsule as estratégias em Guards limpos para usar nos controllers.

```typescript
// src/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

```typescript
// src/auth/guards/jwt-refresh-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
```

---

## 7. Serviço de Autenticação (AuthService)
Contém toda a regra de negócio para gerar hashes, validar credenciais, atualizar tokens e limpar registros no logout.

```typescript
// src/auth/auth.service.ts
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const normalizedEmail = dto.email.toLowerCase();
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      return await this.prisma.user.create({
        data: { email: normalizedEmail, password: hashedPassword },
        select: { id: true, email: true },
      });
    } catch (error) {
      if (error.code === 'P2002') throw new ConflictException('E-mail já cadastrado.');
      throw error;
    }
  }

  async getTokens(userId: number, email: string) {
    const payload = { sub: userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { secret: 'JWT_ACCESS_SECRET', expiresIn: '6h' }),
      this.jwtService.signAsync(payload, { secret: 'JWT_REFRESH_SECRET', expiresIn: '7d' }),
    ]);
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { hashedRefreshToken: hash } });
  }

  async login(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken) throw new UnauthorizedException('Acesso negado.');

    const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!isMatch) throw new UnauthorizedException('Acesso negado.');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.update({ where: { id: userId }, data: { hashedRefreshToken: null } });
    return { message: 'Logout realizado com sucesso' };
  }
}
```

---

## 8. Rotas da API (AuthController)
Disponibiliza os endpoints públicos e protegidos para o fluxo completo do cliente.

```typescript
// src/auth/auth.controller.ts
import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: CreateUserDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Request() req) {
    return this.authService.refreshTokens(req.user.userId, req.user.refreshToken);
  }
}
```

---

## 9. Módulo de Autenticação (AuthModule)
Amarre todas as pontas exportando o serviço e declarando as estratégias.

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { PrismaService } from '../prisma/prisma.service'; // Ajuste o caminho se necessário

@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, PrismaService],
})
export class AuthModule {}
```
