import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; description: string; price: number; imageUrl?: string; categoryId: string }) {
    return this.prisma.product.create({ data });
  }
}