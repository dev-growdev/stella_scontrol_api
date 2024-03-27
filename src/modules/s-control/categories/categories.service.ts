import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/categories-input.dto';
import { PrismaService } from '@shared/modules/prisma/prisma.service';
import Prisma from '@prisma/client';
import { CategoryDto } from './dto/categories-output.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(categoryDto: CreateCategoryDto): Promise<CategoryDto> {
    const findCategory = await this.findCategory(categoryDto.name);
    if (findCategory) {
      throw new BadRequestException('Essa categoria já existe.');
    }

    const createdCategory = await this.prisma.scCategories.create({
      data: {
        name: categoryDto.name,
      },
    });

    return this.mapToDto(createdCategory);
  }

  async findAll(): Promise<CategoryDto[]> {
    try {
      const findAllCategories = await this.prisma.scCategories.findMany({});

      return findAllCategories.map(this.mapToDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(uid: string, data: UpdateCategoryDto): Promise<CategoryDto> {
    const categories = await this.prisma.scCategories.findMany({
      where: {
        OR: [{ uid }, { name: data.name, uid: { not: uid } }],
      },
    });

    if (categories.length === 0) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    for (const category of categories) {
      if (category.uid !== uid) {
        throw new BadRequestException('Essa categoria já existe.');
      }
    }

    const updatedCategory = await this.prisma.scCategories.update({
      where: { uid },
      data: {
        name: data.name,
      },
    });

    return this.mapToDto(updatedCategory);
  }

  async disable(uid: string, enable: boolean): Promise<CategoryDto> {
    const category = await this.findCategory(uid);

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    const updatedCategory = await this.prisma.scCategories.update({
      where: { uid },
      data: {
        enable,
      },
    });

    return this.mapToDto(updatedCategory);
  }

  async findCategory(identifier: string) {
    const findCategory = await this.prisma.scCategories.findFirst({
      where: {
        OR: [{ name: identifier }, { uid: identifier }],
      },
    });

    return findCategory;
  }

  private mapToDto(entity: Prisma.ScCategories): CategoryDto {
    return {
      uid: entity.uid,
      name: entity.name,
      enable: entity.enable,
    };
  }
}
