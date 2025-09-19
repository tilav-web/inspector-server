import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InspectorWorkplaceDocument = InspectorWorkplace & Document;

@Schema()
export class InspectorWorkplace {
  @Prop({ type: Types.ObjectId, ref: 'Inspector', required: true })
  inspector: Types.ObjectId;

  @Prop({ type: String, required: true })
  position: string; // lavozimi

  @Prop({ type: Types.ObjectId, ref: 'Region', required: true })
  region: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'District', required: true })
  district: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Neighborhood', default: null })
  neighborhood: Types.ObjectId;

  @Prop({ type: String, default: null })
  note: string;

  @Prop({ type: Boolean, default: true })
  status: boolean;
}

export const InspectorWorkplaceSchema =
  SchemaFactory.createForClass(InspectorWorkplace);
