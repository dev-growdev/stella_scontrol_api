import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/supplier-input.dto';
import { PrismaService } from '@/shared/modules/prisma/prisma.service';


@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto) {
    const supplier = await this.prisma.sqSupplier.create({data: createSupplierDto})
    return supplier;
  }

  findAll() {
    return `This action returns all supplier`;
  }

  findOne(id: number) {
    return `This action returns a #${id} supplier`;
  }

  update(id: number, updateSupplierDto: any) {
    return `This action updates a #${id} supplier`;
  }

  remove(id: number) {
    return `This action removes a #${id} supplier`;
  }
}
