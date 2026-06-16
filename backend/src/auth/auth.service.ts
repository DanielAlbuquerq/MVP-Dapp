import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto} from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: CreateUserDto) {
    const normalizedEmail = dto.email.toLowerCase();
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {

        //Trabalhar nisto para evitar que o usuário seja criado sem o hash do refresh token, o que causaria problemas no login
       const newUser = await this.prisma.user.create({
        data: {name: dto.name ,email: normalizedEmail, password: hashedPassword },
        select: { id: true, email: true, name: true, password: true},
      });

      const tokens = await this.login({
        email: dto.email,
        password: dto.password,
        //Podemos usar o name sem passar pelo o dto,
        //Pois os dados já devem vir consistentes do banco
        name: newUser.name
      });

      return{
            user: newUser,
            ...tokens,
      }
    } catch (error: any) {
      if (error.code === 'P2002') throw new ConflictException('DTO: E-mail já cadastrado.');
      throw error;
    }
  }

  async getTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      //Uses the Access Secret
      this.jwtService.signAsync(payload, { secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'), expiresIn: this.configService.getOrThrow('JWT_EXPIRES_IN') }),
      //Uses the Refresh Secret
      this.jwtService.signAsync(payload, { secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'), expiresIn: '7d' }),
    ]);
    return { access_token: accessToken, refresh_token: refreshToken, userId, role };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { hashedRefreshToken: hash } });
  }

  async login(dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    console.log('Tokens gerados no login:', tokens); // Log para depuração
    return tokens;
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken) throw new UnauthorizedException('Acesso negado.');

    const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!isMatch) throw new UnauthorizedException('Acesso negado.');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { hashedRefreshToken: null } });
    return { message: 'Logout realizado com sucesso' };
  }
}