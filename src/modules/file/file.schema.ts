import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
  @Prop({ type: Types.ObjectId, required: true })
  document_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  document_name: string;

  @Prop({ type: [String] })
  files: string[];
}

export const FileSchema = SchemaFactory.createForClass(File);
