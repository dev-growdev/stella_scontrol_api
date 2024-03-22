import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  CreateProductDto,
  DisableProductDto,
  UpdateProductDto,
} from './dto/products-input.dto';
import { ProductsService } from './products.service';

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
  disable(@Param('uid') uid: string, @Body() productDto: DisableProductDto) {
    return this.productsService.disable(uid, productDto.enable);
  }
}
