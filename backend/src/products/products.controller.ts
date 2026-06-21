import { Controller, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import 'multer';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    // O NestJS separa automaticamente: 'body' tem os textos, 'file' tem a imagem
    return this.productsService.create(body, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string, 
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File // Opcional, pois na edição o usuário pode não trocar a foto
  ) {
    return this.productsService.update(id, body, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}