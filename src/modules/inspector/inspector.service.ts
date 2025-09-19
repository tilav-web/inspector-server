import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inspector, InspectorDocument } from './inspector.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CreateInspectorDto } from './dto/create-inspector.dto';
import { InspectorWorkplaceService } from '../inspector-workplace/inspector-workplace.service';

@Injectable()
export class InspectorService {
  constructor(
    @InjectModel(Inspector.name) private model: Model<InspectorDocument>,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly inspectorWorkplaceService: InspectorWorkplaceService,
  ) {}

  async findById(id: Types.ObjectId | string) {
    return this.model
      .findById(id)
      .populate('auth', 'username role')
      .populate('address.region')
      .populate('address.district')
      .populate('address.neighborhood')
      .populate('workplaces')

      .lean();
  }

  async findByAuthId(auth: Types.ObjectId | string) {
    return this.model
      .findOne({ auth })
      .populate('auth', 'username role')
      .populate('address.region')
      .populate('address.district')
      .populate('address.neighborhood')
      .populate('workplaces')
      .lean();
  }

  async login({ username, password }: { username: string; password: string }) {
    if (!username)
      throw new BadRequestException('Foydalanuvchi nomi kiritilmagan!');
    if (!password) throw new BadRequestException('Parol kiritilmagan!');

    const auth = await this.authService.findByUsername(username);
    if (!auth)
      throw new BadRequestException(
        'Bu kabi inspektor tizimda mavjut emas. Username tekshiring!',
      );

    const isMatch = await bcrypt.compare(password, auth.password);

    if (!isMatch) throw new BadRequestException('Parolda xatolik bor!');

    const inspector = await this.findByAuthId(auth._id as string);
    const access_token = await this.jwtService.signAsync({
      _id: auth._id,
      username: auth.username,
      role: auth.role,
    });

    return { inspector, access_token };
  }

  async create(dto: CreateInspectorDto) {
    const { inspector_details, auth_details, workplaces_details } = dto;
    const auth = await this.authService.create(auth_details);
    const inspector = await this.model.create({
      ...inspector_details,
      auth: auth._id,
    });

    const inspectorWorkplaces = workplaces_details.map((workplace) => {
      return {
        ...workplace,
        inspector: inspector._id,
      };
    });

    const workplaces =
      await this.inspectorWorkplaceService.createMany(inspectorWorkplaces);

    return {
      ...inspector.toObject(),
      workplaces,
    };
  }

  async findMe(auth_id: string) {
    return await this.findByAuthId(auth_id);
  }
}
