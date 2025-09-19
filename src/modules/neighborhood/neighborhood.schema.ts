import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NeighborhoodDocument = Neighborhood & Document;

@Schema({ timestamps: true })
export class Neighborhood {
  @Prop({ type: Types.ObjectId, ref: 'Region', required: true })
  region: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'District', required: true })
  district: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;
}

export const NeighborhoodSchema = SchemaFactory.createForClass(Neighborhood);
