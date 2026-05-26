import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  // Cria um novo restaurante no banco de dados
  async create(data: { name: string; whatsapp: string; ownerId: string }) {
    return this.prisma.restaurant.create({
      data,
    });
  }

  // Busca todos os restaurantes cadastrados
  async findAll() {
    return this.prisma.restaurant.findMany();
  }
}