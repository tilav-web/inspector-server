import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { GenderEnum } from 'src/enums/gender.enum';

export type InspectorDocument = Inspector & Document;

@Schema({ _id: false })
export class Address {
  @Prop({ type: Types.ObjectId, ref: 'Region', required: true })
  region: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'District', required: true })
  district: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Neighborhood', required: true })
  neighborhood: Types.ObjectId;

  @Prop({ type: String, default: null })
  detail: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ timestamps: true })
export class Inspector {
  @Prop({ type: Types.ObjectId, ref: 'Auth', required: true })
  auth: Types.ObjectId;

  @Prop({ type: String, required: true, minlength: 5 })
  first_name: string;

  @Prop({ type: String, required: true, minlength: 5 })
  last_name: string;

  @Prop({ type: String })
  middle_name: string;

  @Prop({ type: String, required: true })
  birthday: string;

  @Prop({ type: String, required: true, minlength: 2 })
  rank: string; // MFY Inspector ==== unvoni

  @Prop({ type: AddressSchema, required: true })
  address: Address;

  @Prop({ type: Number, required: true, min: 10000000000000 }) // 14 raqamli PINFL
  pinfl: number;

  @Prop({ type: Number, required: true, min: 1000000 }) // passport raqam minimal 7 raqam
  passport_number: number;

  @Prop({ type: String, required: true, minlength: 2, maxlength: 2 })
  passport_series: string;

  @Prop({ type: String, required: true, enum: GenderEnum })
  gender: GenderEnum;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  nationality: string; // millati
}

export const InspectorSchema = SchemaFactory.createForClass(Inspector);
