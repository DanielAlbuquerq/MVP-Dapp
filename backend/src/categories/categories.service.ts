import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; restaurantId: string }) {
    return this.prisma.category.create({ data });
  }

  findAllByRestaurant(restaurantId: string) {
    return this.prisma.category.findMany({
      where: { restaurantId },
      include: { products: true } // Já trazemos os produtos para facilitar o front-end
    });
  }
}