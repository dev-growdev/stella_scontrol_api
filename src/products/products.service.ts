import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(productDTO: ProductDTO) {
    const findProduct = await this.prisma.products.findFirst({
      where: {
        name: productDTO.name,
      },
    });

    if (findProduct) {
      throw new BadRequestException('Esse produto já existe.');
    }

    const findCategory = await this.prisma.categories.findUnique({
      where: { uid: productDTO.categoryId },
    });

    if (!findCategory) {
      throw new BadRequestException('Categoria não encontrada.');
    }

    const createdProduct = await this.prisma.products.create({
      data: {
        categoryId: findCategory.uid,
        code: productDTO.code,
        name: productDTO.name,
        enable: productDTO.enable,
        measurement: productDTO.measurement,
        quantity: productDTO.quantity,
      },
      select: {
        uid: true,
        categoryId: true,
        code: true,
        name: true,
        enable: true,
        measurement: true,
        quantity: true,
      },
    });

    return createdProduct;
  }

  async findAll() {
    try {
      const findAllProducts = await this.prisma.products.findMany({
        select: {
          uid: true,
          categoryId: true,
          code: true,
          name: true,
          enable: true,
          measurement: true,
          quantity: true,
        },
      });

      return findAllProducts;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(uid: string, productDTO: ProductDTO) {
    const product = await this.prisma.products.findUnique({
      where: { uid },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    try {
      const findCategory = await this.prisma.categories.findUnique({
        where: { uid: productDTO.categoryId },
      });
  
      if (!findCategory) {
        throw new BadRequestException('Categoria não encontrada.');
      }

      const findProduct = await this.prisma.products.update({
        where: { uid: product.uid },
        data: {
          categoryId: findCategory.uid,
          code: productDTO.code,
          name: productDTO.name,
          enable: productDTO.enable,
          measurement: productDTO.measurement,
          quantity: productDTO.quantity,
        },
      });

      const data = {
        uid: findProduct.uid,
        categoryId: findProduct.categoryId,
        code: findProduct.code,
        name: findProduct.name,
        enable: findProduct.enable,
        measurement: findProduct.measurement,
        quantity: findProduct.quantity,
      };

      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
