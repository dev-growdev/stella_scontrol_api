import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDto,
  ParamDto,
  UpdateCategoryDto,
  UpdateEnableCategoryDto,
} from './dto/categories-input.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Categorias')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() categoryDto: CreateCategoryDto) {
    return this.categoriesService.create(categoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Put(':uid')
  update(@Param() params: ParamDto, @Body() categoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(params.uid, categoryDto);
  }

  @Put(':uid/disable')
  dissable(
    @Param() params: ParamDto,
    @Body() categoryDto: UpdateEnableCategoryDto,
  ) {
    return this.categoriesService.disable(params.uid, categoryDto);
  }
}
