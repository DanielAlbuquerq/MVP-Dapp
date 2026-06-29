import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012'; 
const IV_LENGTH = 16; 

@Injectable()
export class RestaurantsService {
  private s3Client: S3Client;

  constructor(private prisma: PrismaService) {
    // Configuração AWS S3 reaproveitada
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  private encrypt(text: string) {
    if (!text) return null;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex'); 
  }

  // Função utilitária para Upload na AWS
  private async uploadImageToS3(file: Express.Multer.File): Promise<string> {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_REGION || 'us-east-1';
    const fileName = `${uuidv4()}-${file.originalname.replace(/\s/g, '-')}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    // ATENÇÃO: Descomente a linha abaixo quando tiver as chaves da AWS reais no .env
    // await this.s3Client.send(command); 
    
    // Retornando uma URL fake provisória para você testar localmente sem travar
    return `https://fake-s3-url.com/${fileName}`; 
  }

  async createFullRegistration(data: any, files?: { logo?: Express.Multer.File[], coverImage?: Express.Multer.File[] }) {
    let user = await this.prisma.user.findUnique({
      where: { email: data.ownerEmail.toLowerCase() }
    });

    // Lógica de Criação ou Upgrade (Mantida intacta)
    if (!user) {
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
    } else if (user.role === 'CUSTOMER') {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { role: 'RESTAURANT' },
      });
    }

    // 1. Processamento das Imagens (Logo e Capa)
    let logoUrl: string | null = null;
    let coverImageUrl: string | null = null;

    if (files?.logo && files.logo.length > 0) {
      logoUrl = await this.uploadImageToS3(files.logo[0]);
    }
    
    if (files?.coverImage && files.coverImage.length > 0) {
      coverImageUrl = await this.uploadImageToS3(files.coverImage[0]);
    }

    // 2. Encripta o CNPJ
    const encryptedCnpj = this.encrypt(data.cnpj);

    // 3. Cria o Restaurante com as URLs geradas pela AWS S3
    const restaurant = await this.prisma.restaurant.create({
      data: {
        name: data.restaurantName,
        whatsapp: data.whatsapp,
        phone: data.restaurantPhone,
        address: data.address,
        cnpj: encryptedCnpj, 
        logoUrl: logoUrl,
        coverImageUrl: coverImageUrl,
        ownerId: user.id, 
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

//Função de emergência para fechar todas as lojas
  async closeAllRestaurants() {
    return this.prisma.restaurant.updateMany({
      data: { isOpen: false },
    });
  }

  //Busca os pedidos de um restaurante específico
  async getRestaurantOrders(restaurantId: string) {
    return this.prisma.order.findMany({
      where: { restaurantId },
      include: {
        customer: { select: { phone: true, user: { select: { name: true } } } },
        items: { include: { product: { select: { name: true, price: true } } } }
      },
      orderBy: { createdAt: 'desc' } // Traz os pedidos mais recentes primeiro
    });
  }
}