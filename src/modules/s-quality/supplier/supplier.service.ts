import { Injectable } from '@nestjs/common';
import Prisma from '@prisma/client';
import { CreateSupplierDto } from './dto/supplier-input.dto';
import { PrismaService } from '@/shared/modules/prisma/prisma.service';
import { SupplierDto } from './dto/supplier-output.dto';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<SupplierDto> {
    const supplier = await this.prisma.sqSupplier.create({
      data: createSupplierDto,
    });
    return this.mapToDto(supplier);
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

  private mapToDto(entity: Prisma.SqSupplier): SupplierDto {
    return {
      uid: entity.uid,
      continent: entity.continent,
      email: entity.email,
      enable: entity.enable,
      name: entity.name,
      address: entity.address,
      city: entity.city,
      contactName: entity.contactName,
      country: entity.country,
      phoneNumber: entity.phoneNumber,
      region: entity.region,
    };
  }
}
