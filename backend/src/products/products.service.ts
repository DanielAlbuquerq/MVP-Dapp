import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  //Adicionei o async, mas não tinha antes, então não sei se é necessário.
  async create(data: { name: string; description: string; price: number; imageUrl?: string; categoryId: string }) {
    return this.prisma.product.create({ data });
  }

  // Atualiza se o produto está ativo ou desativado
  async updateStatus(id: string, isActive: boolean) {
    return this.prisma.product.update({
      where: { id },
      data: { isActive },
    });
  }
}