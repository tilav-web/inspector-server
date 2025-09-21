import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './file.schema';
import { join } from 'path';
import sharp from 'sharp';
import { unlinkSync } from 'fs';

@Injectable()
export class FileService {
  constructor(@InjectModel(File.name) private model: Model<FileDocument>) {}

  async converToWebp({ file, id }: { file: Express.Multer.File; id: string }) {
    const fileName = id.toString() + '.webp';
    const filePath = join(process.cwd(), 'uploads/photos', fileName);
    unlinkSync(filePath);
    await sharp(file.buffer).webp({ quality: 80 }).toFile(filePath);
    return fileName;
  }

  async uploadPhoto({ file, id }: { file: Express.Multer.File; id: string }) {
    const fileName = await this.converToWebp({ file, id });
    return fileName;
  }
}
