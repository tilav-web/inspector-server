import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { District, DistrictDocument } from './district.schema';
import { Model } from 'mongoose';

@Injectable()
export class DistrictService {
  constructor(
    @InjectModel(District.name) private model: Model<DistrictDocument>,
  ) {}

  async findById(id: string) {
    return this.model.findById(id);
  }

  async findByRegion(region: string) {
    return this.model.findOne({ region });
  }

  async findAll() {
    return this.model.find();
  }
}
