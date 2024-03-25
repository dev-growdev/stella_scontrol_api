import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDto,
  DisableCategoryDto,
  ParamDto,
  UpdateCategoryDto,
} from './dto/categories-input.dto';

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

  @Patch(':uid/disable')
  disable(@Param() params: ParamDto, @Body() categoryDto: DisableCategoryDto) {
    return this.categoriesService.disable(params.uid, categoryDto.enable);
  }
}
