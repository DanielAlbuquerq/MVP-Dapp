// import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
// import { Transform } from 'class-transformer';

// export class CreateFullRegistrationDto {
//   // --- Dados do Restaurante ---
//   @IsString()
//   @IsNotEmpty()
//   @Transform(({ value }) => 
//     value?.toLowerCase().split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
//   )
//   restaurantName: string;

//   @IsString()
//   @IsNotEmpty()
//   whatsapp: string;

//   @IsString()
//   @IsOptional()
//   restaurantPhone?: string;

//   @IsString()
//   @IsNotEmpty()
//   address: string;

//   @IsString()
//   @IsNotEmpty()
//   cnpj: string;

//   @IsString()
//   @IsOptional()
//   logoUrl?: string;

//   @IsString()
//   @IsOptional()
//   coverImage?: string;

//   // --- Dados do Dono (Usuário) ---
//   @IsString()
//   @IsNotEmpty()
//   @Transform(({ value }) => 
//     value?.toLowerCase().split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
//   )
//   ownerName: string;

//   @IsEmail()
//   @IsNotEmpty()
//   @Transform(({ value }) => value?.toLowerCase().trim())
//   ownerEmail: string;

//   @IsString()
//   @IsNotEmpty()
//   ownerPassword?: string; // mude para o nome correto que você envia do front (ex: password)

//   @IsString()
//   @IsNotEmpty()
//   ownerPhone: string;

//   @IsString()
//   @IsNotEmpty()
//   ownerCpf: string;
// }
