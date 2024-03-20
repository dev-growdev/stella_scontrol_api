import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  DisableProductDto,
  UpdateProductDto,
} from './dto/products-input.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() productDto: CreateProductDto) {
    return this.productsService.create(productDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Put(':uid')
  update(@Param('uid') uid: string, @Body() productDto: UpdateProductDto) {
    return this.productsService.update(uid, productDto);
  }

  @Put(':uid/disable')
  disable(@Param() uid: string, @Body() productDto: DisableProductDto) {
    return this.productsService.disable(uid, productDto.enable);
  }
}
