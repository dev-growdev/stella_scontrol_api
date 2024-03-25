import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/supplier-input.dto';


@Injectable()
export class SupplierService {
  create(createSupplierDto: CreateSupplierDto) {
    return 'This action adds a new supplier';
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
