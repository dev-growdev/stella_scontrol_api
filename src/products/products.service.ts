import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(productDTO: ProductDTO) {
    const existingProduct = await this.prisma.products.findFirst({
      where: {
        name: productDTO.name,
      },
    });

    if (existingProduct) {
      throw new BadRequestException('Esse produto já existe.');
    }

    const findCategory = await this.prisma.categories.findUnique({
      where: { uid: productDTO.categoryId },
    });

    if (!findCategory) {
      throw new BadRequestException('Categoria não encontrada.');
    }

    const generatedCode = Math.floor(Math.random() * 100000).toString();

    const createdProduct = await this.prisma.products.create({
      data: {
        categoryId: findCategory.uid,
        code: generatedCode,
        name: productDTO.name,
        enable: productDTO.enable,
        description: productDTO.description,
        measurement: productDTO.measurement,
        quantity: productDTO.quantity,
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

    return createdProduct;
  }

  async findAll() {
    try {
      const findAllProducts = await this.prisma.products.findMany({
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

    const findProduct = await this.prisma.products.findFirst({
      where: {
        name: productDTO.name,
      },
    });

    if (findProduct) {
      throw new BadRequestException('Esse produto já existe.');
    }

    try {
      const findCategory = await this.prisma.categories.findUnique({
        where: { uid: productDTO.categoryId },
      });

      if (!findCategory) {
        throw new BadRequestException('Categoria não encontrada.');
      }

      const updatedData: Partial<ProductDTO> = {
        categoryId: findCategory.uid,
        code: productDTO.code,
        name: productDTO.name,
        description: productDTO.description,
        measurement: productDTO.measurement,
        quantity: productDTO.quantity,
      };

      const updatedProduct = await this.prisma.products.update({
        where: { uid: product.uid },
        data: updatedData,
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

      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async disable(uid: string, enable: boolean) {
    const product = await this.prisma.products.findUnique({
      where: { uid },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    try {
      const disableProduct = await this.prisma.products.update({
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

      return disableProduct;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
