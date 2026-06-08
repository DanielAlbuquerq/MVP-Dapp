import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    // Verifica se o usuário existe ou se a senha criptografada confere
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // Gera o token JWT com as informações básicas do usuário
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      userId: user.id
    };
  }

  // Função de Cadastro com Criptografia
  async register(name: string, email: string, pass: string) {
    // O número 10 é o "salt rounds", define a força da criptografia
    const hashedPassword = await bcrypt.hash(pass, 10);
    
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN', 
      },
    });

    // Já retorna o usuário logado (com token) após o cadastro
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      userId: user.id
    };
  }

}