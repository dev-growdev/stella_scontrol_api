import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Prisma from '@prisma/client';
import { PrismaService } from '@shared/modules/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/products-input.dto';
import { ProductDto } from './dto/products-output.dto';

interface IProductWithRelations extends Prisma.ScProducts {
  category?: Prisma.ScCategories;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const productsAlreadyExists = await this.prisma.scProducts.findFirst({
      where: {
        name: createProductDto.name,
      },
    });

    if (productsAlreadyExists) {
      throw new BadRequestException('Esse produto já existe.');
    }

    const categoryExists = await this.prisma.scCategories.findUnique({
      where: { uid: createProductDto.categoryId },
    });

    if (!categoryExists) {
      throw new BadRequestException('Categoria não encontrada.');
    }

    const createdProduct = await this.prisma.scProducts.create({
      data: {
        categoryId: categoryExists.uid,
        name: createProductDto.name,
        enable: createProductDto.enable,
        description: createProductDto.description,
        measurement: createProductDto.measurement,
        quantity: createProductDto.quantity,
      },
    });

    return this.mapToDto(createdProduct);
  }

  async findAll() {
    const products = await this.prisma.scProducts.findMany({
      select: {
        uid: true,
        code: true,
        name: true,
        enable: true,
        description: true,
        measurement: true,
        quantity: true,
        category: {
          select: {
            uid: true,
            name: true,
            enable: true,
          },
        },
      },
    });

    return products.map(this.mapToDto);
  }

  async update(uid: string, updateProductDto: UpdateProductDto) {
    const productsSameNameOrUid = await this.prisma.scProducts.findMany({
      where: {
        OR: [{ name: updateProductDto.name }, { uid: uid }],
      },
      select: {
        uid: true,
        code: true,
        name: true,
        enable: true,
        description: true,
        measurement: true,
        quantity: true,
        category: {
          select: {
            uid: true,
            name: true,
            enable: true,
          },
        },
      },
    });

    if (productsSameNameOrUid.length === 0) {
      throw new NotFoundException('Produto não encontrado.');
    }

    for (const product of productsSameNameOrUid) {
      if (product.uid !== uid) {
        throw new BadRequestException('Esse produto já existe.');
      }
    }

    const findCategory = await this.prisma.scCategories.findUnique({
      where: { uid: updateProductDto.categoryId },
    });

    if (!findCategory) {
      throw new BadRequestException('Categoria não encontrada.');
    }

    const updatedProduct = await this.prisma.scProducts.update({
      where: { uid },
      data: updateProductDto,
      select: {
        uid: true,
        code: true,
        name: true,
        enable: true,
        description: true,
        measurement: true,
        quantity: true,
        category: {
          select: {
            uid: true,
            name: true,
            enable: true,
          },
        },
      },
    });

    return this.mapToDto(updatedProduct);
  }

  async disable(uid: string, enable: boolean) {
    const product = await this.prisma.scProducts.findUnique({
      where: {
        uid: uid,
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    const disableProduct = await this.prisma.scProducts.update({
      where: { uid },
      data: {
        enable,
      },
      select: {
        uid: true,
        code: true,
        name: true,
        enable: true,
        description: true,
        measurement: true,
        quantity: true,
        category: {
          select: {
            uid: true,
            name: true,
            enable: true,
          },
        },
      },
    });

    return this.mapToDto(disableProduct);
  }

  private mapToDto(entity: any): ProductDto {
    let category: ProductDto['category'];

    if (entity.category) {
      category = {
        uid: entity.category.uid,
        name: entity.category.name,
        enable: entity.category.enable,
      };
    }

    return {
      uid: entity.uid,
      code: entity.code,
      name: entity.name,
      enable: entity.enable,
      description: entity.description,
      measurement: entity.measurement,
      quantity: entity.quantity,
      ...(category && { category }),
    };
  }
}
