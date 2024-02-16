import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDTO } from './dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() productDTO: ProductDTO) {
    return this.productsService.create(productDTO);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Put(':uid')
  update(@Param('uid') uid: string, @Body() productDTO: ProductDTO) {
    return this.productsService.update(uid, productDTO);
  }

  @Put(':uid/disable')
  disable(@Param('uid') uid: string, @Body() productDTO: ProductDTO) {
    return this.productsService.disable(uid, productDTO.enable);
  }
}
