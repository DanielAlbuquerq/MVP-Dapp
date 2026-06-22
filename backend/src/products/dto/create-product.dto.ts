import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CapitalizeWords } from './capitalize-words.decorator'

export class CreateProductDto {

  @IsString()
  @IsNotEmpty()
  @CapitalizeWords()
  name!: string;
}