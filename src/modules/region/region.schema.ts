import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RegionDocument = Region & Document;

@Schema({ timestamps: true })
export class Region {
  @Prop({ type: Types.ObjectId, ref: 'Inspector', required: true })
  inspector: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;
}

export const RegionSchema = SchemaFactory.createForClass(Region);
