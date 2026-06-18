import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
// import { CategoryType } from '@prisma/client';
import { CategoryType } from '../../generated/prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() body: { name: string; restaurantId: string; categoryType?: CategoryType }) {
    return this.categoriesService.create(body);
  }

  @Get('restaurant/:restaurantId')
  findAllByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.categoriesService.findAllByRestaurant(restaurantId);
  }
}