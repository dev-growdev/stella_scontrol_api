import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  UpdateEnableCategoryDto,
} from './dto/categories-input.dto';
import { PrismaService } from '@shared/modules/prisma/prisma.service';
import Prisma from '@prisma/client';
import { CategoryDto } from './dto/categories-output.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(categoryDto: CreateCategoryDto): Promise<CategoryDto> {
    const findCategory = await this.prisma.categories.findFirst({
      where: {
        name: categoryDto.name,
      },
    });

    if (findCategory) {
      throw new BadRequestException('Essa categoria já existe.');
    }

    const createdCategory = await this.prisma.categories.create({
      data: {
        name: categoryDto.name,
      },
    });

    return this.mapToDto(createdCategory);
  }

  async findAll(): Promise<CategoryDto[]> {
    try {
      const findAllCategories = await this.prisma.categories.findMany({});

      return findAllCategories.map(this.mapToDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(uid: string, data: UpdateCategoryDto): Promise<CategoryDto> {
    const categories = await this.prisma.categories.findMany({
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
    // const category = await this.prisma.categories.findUnique({
    //   where: { uid },
    // });

    // if (!category) {
    //   throw new NotFoundException('Categoria não encontrada.');
    // }

    // const findCategoryByName = await this.prisma.categories.findFirst({
    //   where: {
    //     name,
    //     uid: { not: uid },
    //   },
    // });

    // if (findCategoryByName) {
    //   throw new BadRequestException('Essa categoria já existe.');
    // }

    const updatedCategory = await this.prisma.categories.update({
      where: { uid },
      data: {
        name: data.name,
      },
    });

    return this.mapToDto(updatedCategory);
  }

  async disable(
    uid: string,
    data: UpdateEnableCategoryDto,
  ): Promise<CategoryDto> {
    const category = await this.prisma.categories.findUnique({
      where: { uid },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    const updatedCategory = await this.prisma.categories.update({
      where: { uid },
      data: {
        enable: data.enable,
      },
    });

    return this.mapToDto(updatedCategory);
  }

  private mapToDto(entity: Prisma.Categories): CategoryDto {
    return {
      uid: entity.uid,
      name: entity.name,
      enable: entity.enable,
    };
  }
}
