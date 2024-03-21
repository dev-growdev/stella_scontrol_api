import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Prisma from '@prisma/client';
import { PrismaService } from '@shared/modules/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/products-input.dto';
import { ProductDto } from './dto/products-output.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const productsAlreadyExists = await this.prisma.products.findFirst({
      where: {
        name: createProductDto.name,
      },
    });

    if (productsAlreadyExists) {
      throw new BadRequestException('Esse produto já existe.');
    }

    const categoryExists = await this.prisma.categories.findUnique({
      where: { uid: createProductDto.categoryId },
    });

    if (!categoryExists) {
      throw new BadRequestException('Categoria não encontrada.');
    }

    const createdProduct = await this.prisma.products.create({
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
    const products = await this.prisma.products.findMany({});

    return products.map(this.mapToDto);
  }

  async update(uid: string, updateProductDto: UpdateProductDto) {
    const productsSameNameOrUid = await this.prisma.products.findMany({
      where: { OR: [{ name: updateProductDto.name }, { uid: uid }] },
    });

    if (productsSameNameOrUid.length === 0) {
      throw new NotFoundException('Produto não encontrado.');
    }

    for (const product of productsSameNameOrUid) {
      if (product.uid !== uid) {
        throw new BadRequestException('Esse produto já existe.');
      }
    }

    const findCategory = await this.prisma.categories.findUnique({
      where: { uid: updateProductDto.categoryId },
    });

    if (!findCategory) {
      throw new BadRequestException('Categoria não encontrada.');
    }

    const updatedProduct = await this.prisma.products.update({
      where: { uid },
      data: updateProductDto,
    });

    return this.mapToDto(updatedProduct);
  }

  async disable(uid: string, enable: boolean) {
    const product = await this.prisma.products.findUnique({
      where: { uid },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    const disableProduct = await this.prisma.products.update({
      where: { uid },
      data: {
        enable,
      },
    });

    return this.mapToDto(disableProduct);
  }

  private mapToDto(entity: IProductWithRelations): ProductDto {
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

interface IProductWithRelations extends Prisma.Products {
  category?: Prisma.Categories;
}
