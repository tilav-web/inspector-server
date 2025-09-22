import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Neighborhood, NeighborhoodDocument } from './neighborhood.schema';
import { Model } from 'mongoose';

@Injectable()
export class NeighborhoodService {
  constructor(
    @InjectModel(Neighborhood.name) private model: Model<NeighborhoodDocument>,
  ) {}

  async findById(id: string) {
    return this.model.findById(id);
  }

  async findByRegionAndDistrict({
    region,
    district,
  }: {
    region?: string;
    district?: string;
  }) {
    return this.model.find({ region, district });
  }

  async findAll() {
    return this.model.find();
  }
}
