import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(categoryDto: CategoriesDTO) {
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
        select: {
          uid: true,
          name: true,
          enable: true,
        },
      });

      return createdCategory;
  }

  async findAll() {
    try {
      const findAllCategories = await this.prisma.categories.findMany({
        select: {
          uid: true,
          name: true,
          enable: true,
        },
      });

      return findAllCategories;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(uid: string, categoryDTO: CategoriesDTO) {
    const category = await this.prisma.categories.findUnique({
      where: { uid },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    const findCategory = await this.prisma.categories.findFirst({
      where: {
        name: categoryDTO.name,
      },
    });

    if (findCategory) {
      throw new BadRequestException('Essa categoria já existe.');
    }

    try {
      const findCategory = await this.prisma.categories.update({
        where: { uid: category.uid },
        data: {
          name: categoryDTO.name,
          enable: categoryDTO.enable,
        },
      });

      const data = {
        uid: findCategory.uid,
        name: findCategory.name,
        enable: findCategory.enable,
      };

      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
