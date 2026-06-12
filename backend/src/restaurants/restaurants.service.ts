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
// Atualiza o estado de aberto/fechado do restaurante
  async updateStatus(id: string, isOpen: boolean) {
    return this.prisma.restaurant.update({
      where: { id },
      data: { isOpen },
    });
  }

  // async findOne(id: string) {
  //   return this.prisma.restaurant.findUnique({
  //     where: { id },
  //     include: { categories: true }, // Já trazemos as categorias para facilitar o front-end
  //   });
  // }
}