import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { CategoryType } from '@prisma/client'; // Importe o Enum do Prisma
import { CategoryType } from '../../generated/prisma/client';


@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // Adicionamos o categoryType opcional aqui
  create(data: { name: string; restaurantId: string; categoryType?: CategoryType }) {
    return this.prisma.category.create({ data });
  }

  findAllByRestaurant(restaurantId: string) {
    return this.prisma.category.findMany({
      where: { restaurantId },
      include: { products: true }
    });
  }
}