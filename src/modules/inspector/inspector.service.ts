import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inspector, InspectorDocument } from './inspector.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class InspectorService {
  constructor(
    @InjectModel(Inspector.name) private model: Model<InspectorDocument>,
  ) {}

  async findById(id: Types.ObjectId | string) {
    return this.model
      .findById(id)
      .populate('auth', 'username role')
      .populate('region')
      .populate('district')
      .populate('neighborhood')
      .populate('workplaces')

      .lean();
  }

  async findByAuthId(auth: Types.ObjectId | string) {
    return this.model
      .findOne({ auth })
      .populate('auth', 'username role')
      .populate('region')
      .populate('district')
      .populate('neighborhood')
      .populate('workplaces')
      .lean();
  }
}
