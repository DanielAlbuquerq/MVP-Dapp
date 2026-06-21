import { UsePipes, ValidationPipe, Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // @Post('register-full')
  // createFull(@Body() body: CreateFullRegistrationDto) {
  //   return this.restaurantsService.createFullRegistration(body);
  // }

  @Post('register-full')
  createFull(@Body() body: any) {
    return this.restaurantsService.createFullRegistration(body);
  }

  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }

  // @Get(':ownerID')
  //   findByOwner(@Param('ownerID') ownerID: string) {
  //     return this.restaurantsService.findAllByOwner(ownerID);
  //   }
  

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('isOpen') isOpen: boolean) {
    return this.restaurantsService.updateStatus(id, isOpen);
  }
}