import { Controller, Get, Post, Body } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  create(@Body() body: { name: string; whatsapp: string; ownerId: string }) {
    return this.restaurantsService.create(body);
  }

  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }
  // @Get(':id')
  // findOne(@Body() body: { id: string }) {
  //   return this.restaurantsService.findOne(body.id);
  // }
}