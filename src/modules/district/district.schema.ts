import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DistrictDocument = District & Document;

@Schema({ timestamps: true })
export class District {
  @Prop({ type: Types.ObjectId, ref: 'Region', required: true })
  region: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;
}

export const DistrictSchema = SchemaFactory.createForClass(District);
