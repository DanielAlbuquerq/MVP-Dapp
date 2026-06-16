# NestJS Complete Typed JWT & Config Setup Guide

This guide covers the industry-standard implementation for setting up a type-safe JWT authentication system using `@nestjs/config`, `joi`, and `@nestjs/jwt` in NestJS.

---

## 1. Installation

Install the required dependencies for environment configuration, schema validation, and authentication:

```bash
npm i @nestjs/config joi @nestjs/passport passport passport-jwt @nestjs/jwt
npm i -D @types/passport-jwt
```

---

## 2. Environment Schema Validation & Registration

Define strict validation rules using **Joi** to ensure the app crashes immediately on startup if crucial variables like `JWT_SECRET` are missing.

### `src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().required(), // App will fail to start if missing
        JWT_EXPIRES_IN: Joi.string().default('1d'),
      }),
    }),
    AuthModule,
  ],
})
export class AppModule {}
```

---

## 3. Strongly-Typed Configuration Object

Create a namespaced configuration block to provide full IDE autocomplete and prevent runtime string typos.

### `src/auth/config/jwt.config.ts`
```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
}));
```

---

## 4. Asynchronous Auth Module Setup

Wire the typed configurations into the authentication layer. We pass `jwtConfig` down into the module scope.

### `src/auth/auth.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import jwtConfig from './config/jwt.config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forFeature(jwtConfig), // Loads config for this module scope
    JwtModule.registerAsync({
      inject: [jwtConfig.KEY],
      useFactory: (jwtConfiguration: ConfigType<typeof jwtConfig>) => ({
        secret: jwtConfiguration.secret,
        signOptions: {
          expiresIn: jwtConfiguration.expiresIn,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

---

## 5. Type-Safe Passport JWT Strategy

Inject the strongly-typed configuration token into the passport strategy class constructor.

### `src/auth/jwt.strategy.ts`
```typescript
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from './config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret, // Type-safe property access
    });
  }

  async validate(payload: any) {
    // This return value gets attached automatically to req.user
    return { userId: payload.sub, username: payload.username };
  }
}
```

---

## 6. Token Generation in AuthService

Use the configured `JwtService` to build and sign tokens.

### `src/auth/auth.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: any) {
    const payload = { 
      username: user.username, 
      sub: user.id 
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

---

## 7. Guard & Custom Decorator (Route Protection)

Create a dedicated guard to handle route locking and a custom parameter decorator to safely pull user properties from the execution context.

### `src/auth/guards/jwt-auth.guard.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### `src/auth/decorators/current-user.decorator.ts`
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If a specific property key is passed (e.g., @CurrentUser('userId')), return only that property
    return data ? user?.[data] : user;
  },
);
```

---

## 8. HTTP Endpoints and Usage

Expose authentication endpoints and use the guards and decorators to protect private routes.

### `src/auth/auth.controller.ts`
```typescript
import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: any) {
    // Implement database credential validation logic here
    const mockValidUser = { id: 1, username: loginDto.username }; 

    return this.authService.login(mockValidUser);
  }

  // 🔒 Protected Profile Endpoint
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return user; // Returns the payload structured in JwtStrategy.validate()
  }

  // 🔒 Protected Endpoint fetching only a specific user field
  @UseGuards(JwtAuthGuard)
  @Get('id')
  getUserId(@CurrentUser('userId') userId: number) {
    return { id: userId };
  }
}
```

---

## 9. Unit Testing the JwtStrategy

Create a test block using NestJS testing utilities and Jest to verify your strategy accurately parses and formats token payloads. Because we used `registerAs('jwt')`, we must mock the configuration namespace key `jwt.KEY`.

### `src/auth/jwt.strategy.spec.ts`
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import jwtConfig from './config/jwt.config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  // Mocking the custom configuration object structure
  const mockJwtConfig = {
    secret: 'test_super_secret_key_123',
    expiresIn: '1d',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          // Provide the token mapping that our @Inject(jwtConfig.KEY) expects
          provide: jwtConfig.KEY,
          useValue: mockJwtConfig,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should unpack, transform and return the valid token payload data', async () => {
      const mockPayload = {
        sub: 42,
        username: 'john_doe',
        iat: 1600000000,
        exp: 1600086400,
      };

      const result = await strategy.validate(mockPayload);

      // Verifies the strategy properties remap 'sub' to 'userId' correctly
      expect(result).toEqual({
        userId: 42,
        username: 'john_doe',
      });
    });
  });
});
```

To run this specific test file in your terminal, use:
```bash
npm run test -- src/auth/jwt.strategy.spec.ts
```
