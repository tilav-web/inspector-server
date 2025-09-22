import { Injectable } from '@nestjs/common';
import { CreateInspectorWorkplaceDto } from './dto/create-inspector-workplace.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  InspectorWorkplace,
  InspectorWorkplaceDocument,
} from './inspector-workplace.schema';
import { Model } from 'mongoose';

@Injectable()
export class InspectorWorkplaceService {
  constructor(
    @InjectModel(InspectorWorkplace.name)
    private model: Model<InspectorWorkplaceDocument>,
  ) {}

  async create(dto: CreateInspectorWorkplaceDto & { inspector: string }) {
    return this.model.create(dto);
  }

  async findByInspectorId(inspector: string) {
    return this.model.findOne({ inspector, status: true });
  }
}
