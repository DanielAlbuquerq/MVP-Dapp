import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Por favor, insira um e-mail válido.' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'A senha deve conter no mínimo 8 caracteres.' })
  password!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;
}