import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  private s3Client: S3Client;

  constructor(private prisma: PrismaService) {
    // Configuração de conexão com a AWS S3
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  // Função utilitária que faz o Upload para a AWS
  private async uploadImageToS3(file: Express.Multer.File): Promise<string> {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_REGION || 'us-east-1';
    
    // Cria um nome de arquivo único para não sobrescrever imagens
    const fileName = `${uuidv4()}-${file.originalname.replace(/\s/g, '-')}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // Permite que a imagem seja vista por qualquer pessoa no App
    });

    await this.s3Client.send(command); //Ativar ou Destivar quando estiver com conta AWS

    // Retorna a URL pública montada
    return `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
  }

  async create(data: any, file?: Express.Multer.File) {
    let imageUrl: string | null = null

    // Se o usuário enviou uma foto, fazemos o upload primeiro
    if (file) {
      imageUrl = await this.uploadImageToS3(file);
    }

    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price), // FormData envia tudo como string
        categoryId: data.categoryId,
        imageUrl: imageUrl, 
      },
    });
  }

  async update(id: string, data: any, file?: Express.Multer.File) {
    let imageUrl: string | undefined = undefined; // Se continuar undefined, o Prisma ignora e mantém a foto antiga no banco

    // Se o usuário trocou a foto no Modal, fazemos upload da nova
    if (file) {
      imageUrl = await this.uploadImageToS3(file);
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price ? parseFloat(data.price) : undefined,
        isActive: data.isActive === 'true', // FormData envia boolean como string ('true' ou 'false')
        imageUrl: imageUrl,
      },
    });
  }

  async remove(id: string) {
    // Nota: Numa arquitetura real, você pode adicionar a lógica aqui para apagar a foto da AWS também,
    // mas por enquanto apagar do banco já atende nosso MVP.
    return this.prisma.product.delete({
      where: { id },
    });
  }
}