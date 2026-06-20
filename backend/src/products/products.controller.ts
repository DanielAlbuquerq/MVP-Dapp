import { Controller, Patch, Param, Post, Body, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() body: { name: string; description: string; price: number; imageUrl?: string; categoryId: string }) {
    return this.productsService.create(body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.productsService.updateStatus(id, isActive);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}