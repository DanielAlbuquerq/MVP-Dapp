import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from 'generated/prisma/client';


//import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Rota de Login
  @Post('login')
  login(@Body() body: Record<string, string>) {
    return this.authService.login(body.email, body.password);
  }
  
  @Post('register')
  register(@Body() body: Record<string, string>) {
    return this.authService.register(body.name, body.email, body.password, body.role.toUpperCase() as Role);
  }

  // @Get('user')
  // findUnique() {
  //   return this.authService.findUnique();
  // }

}