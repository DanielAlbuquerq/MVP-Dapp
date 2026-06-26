import { Controller, Get, Post, Body, Patch, Param, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import 'multer';
import type { Express } from 'express';

//Adicionar DTOs depois para validar todas info antes de chegar nas rotas

//Gotchas and recommendations: ensure the interceptor field names match 
//these keys, guard against undefined files, validate and type the body 
//(use DTOs/validation pipes instead of any), and avoid trusting client-provided 
//metadata — validate MIME type/size and securely store or stream file data in the service.

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post('register-full')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'logo', maxCount: 1 }, //Aceita apenas uma imagem
    { name: 'coverImage', maxCount: 1 }, //Aceita apenas uma imagem
  ]))
  createFull(
    @Body() body: any,
    @UploadedFiles() files: { logo?: Express.Multer.File[], coverImage?: Express.Multer.File[] }
  ) {
    // Repassamos o formulário em texto e os arquivos binários para o Service processar
    return this.restaurantsService.createFullRegistration(body, files);
  }

  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Get(':id/orders')
  getOrders(@Param('id') id: string) {
    return this.restaurantsService.getRestaurantOrders(id);
  } 

  //Rota de Emergência (DEVE FICAR ACIMA DA ROTA COM :id)
  @Patch('close-all')
  closeAll() {
    return this.restaurantsService.closeAllRestaurants();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('isOpen') isOpen: boolean) {
    return this.restaurantsService.updateStatus(id, isOpen);
  }

}