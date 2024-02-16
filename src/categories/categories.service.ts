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

  async update(uid: string, name: string) {
    const category = await this.prisma.categories.findUnique({
      where: { uid },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    const findCategoryByName = await this.prisma.categories.findFirst({
      where: {
        name,
        uid: { not: uid },
      },
    });

    if (findCategoryByName) {
      throw new BadRequestException('Essa categoria já existe.');
    }

    try {
      const updatedCategory = await this.prisma.categories.update({
        where: { uid },
        data: {
          name,
        },
        select: {
          uid: true,
          name: true,
          enable: true,
        },
      });

      return updatedCategory;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async disable(uid: string, enable: boolean) {
    const category = await this.prisma.categories.findUnique({
      where: { uid },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    try {
      const updatedCategory = await this.prisma.categories.update({
        where: { uid },
        data: {
          enable,
        },
        select: {
          uid: true,
          name: true,
          enable: true,
        },
      });

      return updatedCategory;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
