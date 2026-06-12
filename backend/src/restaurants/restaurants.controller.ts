import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  create(@Body() body: { name: string; whatsapp: string; ownerId: string }) {
    return this.restaurantsService.create(body);
  }

  //Atualiza o estado de aberto/fechado do restaurante
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('isOpen') isOpen: boolean) {
    return this.restaurantsService.updateStatus(id, isOpen);
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