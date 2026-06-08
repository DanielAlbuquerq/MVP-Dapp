import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Rota de Login
  @Post('login')
  login(@Body() body: Record<string, string>) {
    return this.authService.login(body.email, body.password);
  }
  
  // Rota de Cadastro
  @Post('register')
  register(@Body() body: Record<string, string>) {
    return this.authService.register(body.name, body.email, body.password);
  }
}