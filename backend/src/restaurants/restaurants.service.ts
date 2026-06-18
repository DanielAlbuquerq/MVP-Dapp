import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012'; 
const IV_LENGTH = 16; 

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  private encrypt(text: string) {
    if (!text) return null;

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    
    encrypted = Buffer.concat([encrypted, cipher.final()]);
   
    return iv.toString('hex') + ':' + encrypted.toString('hex'); 
  }

  async createFullRegistration(data: any) {
    // 1. Busca se o usuário (Dono) já existe no banco ignorando case sensitive
    let user = await this.prisma.user.findUnique({
      where: { email: data.ownerEmail.toLowerCase() }
    });

    // 2. Lógica de Criação ou UPGRADE de Conta
    if (!user) {
      // Se o usuário NÃO existir, nós o criamos normalmente já como RESTAURANT
      const hashedPassword = await bcrypt.hash(data.ownerPassword, 10);
      user = await this.prisma.user.create({
        data: {
          name: data.ownerName,
          email: data.ownerEmail.toLowerCase(),
          password: hashedPassword,
          phone: data.ownerPhone,
          cpf: data.ownerCpf, 
          role: 'RESTAURANT',
        },
      });
    } else {
      // HIERARQUIA DE PERMISSÕES: Se o usuário já existe, validamos o papel (role) dele.
      // Se ele for um cliente comum (CUSTOMER), fazemos o UPGRADE dele para RESTAURANT.
      if (user.role === 'CUSTOMER') {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { role: 'RESTAURANT' },
        });
      }
      // Nota: Se ele já for 'RESTAURANT' ou 'ADMIN', o if acima é ignorado e o cargo dele é mantido.
    }

    // 3. Encripta o CNPJ do novo Restaurante com AES-256
    const encryptedCnpj = this.encrypt(data.cnpj);

    // 4. Cria o Restaurante vinculando ao ID do usuário (novo ou atualizado)
    const restaurant = await this.prisma.restaurant.create({
      data: {
        name: data.restaurantName,
        whatsapp: data.whatsapp,
        phone: data.restaurantPhone,
        address: data.address,
        cnpj: encryptedCnpj, 
        logoUrl: data.logoUrl,
        coverImageUrl: data.coverImage,
        ownerId: user.id, // Aqui: reaproveitamos o ID independentemente de ser novo ou existente
      },
    });

    return restaurant;
  }

  async findAll() {
    return this.prisma.restaurant.findMany({
      include: { owner: { select: { name: true, email: true } } }
    });
  }

  async updateStatus(id: string, isOpen: boolean) {
    return this.prisma.restaurant.update({
      where: { id },
      data: { isOpen },
    });
  }
}