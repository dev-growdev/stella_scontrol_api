import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesDTO } from './dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() categoryDto: CategoriesDTO) {
    return this.categoriesService.create(categoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Put(':uid')
  update(@Param('uid') uid: string, @Body() categoryDto: CategoriesDTO) {
    return this.categoriesService.update(uid, categoryDto.name);
  }

  @Put(':uid/disable')
  dissable(@Param('uid') uid: string, @Body() categoryDto: CategoriesDTO) {
    return this.categoriesService.disable(uid, categoryDto.enable);
  }
}
