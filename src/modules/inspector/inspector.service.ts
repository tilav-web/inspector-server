import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inspector, InspectorDocument } from './inspector.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CreateInspectorDto } from './dto/create-inspector.dto';
import { InspectorWorkplaceService } from '../inspector-workplace/inspector-workplace.service';
import { GenderEnum } from 'src/enums/gender.enum';
import { AuthRoleEnum } from 'src/enums/auth-role.enum';
import { FileService } from '../file/file.service';
import { v4 as uuidv4 } from 'uuid';

export interface ISearchQuery {
  full_name?: string;
  rank?: string;
  gender?: GenderEnum;
  region?: string;
  district?: string;
  neighborhood?: string;
}

@Injectable()
export class InspectorService {
  constructor(
    @InjectModel(Inspector.name) private model: Model<InspectorDocument>,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly inspectorWorkplaceService: InspectorWorkplaceService,
    private readonly fileService: FileService,
  ) {}

  async findById({ id, auth_id }: { id: string; auth_id: string }) {
    const auth = await this.authService.findById(auth_id);

    if (!auth)
      throw new UnauthorizedException(
        "Inspektorlar ro'yhatini olish uchun siz tizimga kirishingiz kerak",
      );

    const authInspector = await this.findByAuthId(auth_id);

    if (!authInspector)
      throw new UnauthorizedException(
        'Sizning inspektorlik malumotlaringiz kiritilmagan!',
      );

    const authWorkplace =
      await this.inspectorWorkplaceService.findByInspectorId(
        authInspector._id as string,
      );

    if (!authWorkplace)
      throw new UnauthorizedException('Sizning ish joyingiz aniq emas!');

    const inspector = await this.model
      .findById(id)
      .populate('auth', 'username role')
      .populate('address.region')
      .populate('address.district')
      .populate('address.neighborhood')
      .populate('workplaces')
      .lean();

    if (!inspector)
      throw new BadRequestException('Bu inspektor tizimda mavjut emas!');

    const inspectorWorkplace =
      await this.inspectorWorkplaceService.findByInspectorId(
        inspector._id as string,
      );

    if (auth.role === AuthRoleEnum.STATE) return inspector;
    if (
      auth.role === AuthRoleEnum.REGION &&
      inspectorWorkplace?.region === authWorkplace.region
    )
      return inspector;

    if (
      auth.role === AuthRoleEnum.DISTRICT &&
      inspectorWorkplace?.district === authWorkplace.district
    )
      return inspector;

    throw new ForbiddenException(
      "Bu inspektor malumotlarini ko'rish sizning vakolatingizga kirmaydi!",
    );
  }

  async findAll({
    full_name,
    rank,
    gender,
    region,
    district,
    neighborhood,
    page = 1,
    limit = 20,
    auth_id,
  }: ISearchQuery & { page?: number; limit?: number } & { auth_id: string }) {
    const query: Record<string, any> = {};

    const auth = await this.authService.findById(auth_id);

    if (!auth)
      throw new UnauthorizedException(
        "Inspektorlar ro'yhatini olish uchun siz tizimga kirishingiz kerak",
      );

    if (auth.role === AuthRoleEnum.NEIGHBORHOOD)
      throw new ForbiddenException(
        "Inspektorlar ro'yhatini olish huquqi sizga berilmagan!",
      );

    const inspector = await this.findByAuthId(auth._id as string);

    if (!inspector)
      throw new UnauthorizedException(
        'Sizning inspektorlik malumotlaringiz kiritilmagan!',
      );

    const workplace = await this.inspectorWorkplaceService.findByInspectorId(
      inspector._id as string,
    );

    if (!workplace)
      throw new UnauthorizedException('Sizning ish joyingiz aniq emas!');

    if (full_name)
      query.$or = [
        {
          first_name: { $regex: full_name, $options: 'i' },
        },
        {
          last_name: { $regex: full_name, $options: 'i' },
        },
        {
          middle_name: { $regex: full_name, $options: 'i' },
        },
      ];
    if (rank) query.rank = { $regex: rank, $options: 'i' };
    if (gender) query.gender = gender;

    if (auth.role === AuthRoleEnum.STATE) {
      if (region) query.region = region;
      if (district) query.district = district;
      if (neighborhood) query.neighborhood = neighborhood;
    }
    if (auth.role === AuthRoleEnum.REGION) {
      query.region = workplace.region;
      if (district) query.district = district;
      if (neighborhood) query.neighborhood = neighborhood;
    }

    if (auth.role === AuthRoleEnum.DISTRICT) {
      query.district = workplace.district;
      if (neighborhood) query.neighborhood = neighborhood;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate('auth', 'username role')
        .populate('address.region')
        .populate('address.district')
        .populate('address.neighborhood')
        .populate('workplaces')
        .lean(),
      this.model.countDocuments(query),
    ]);

    return {
      data,
      total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByAuthId(auth: Types.ObjectId | string) {
    return this.model
      .findOne({ auth })
      .populate('auth', 'username role')
      .populate('address.region')
      .populate('address.district')
      .populate('address.neighborhood')
      .populate({
        path: 'workplaces',
        populate: [
          { path: 'region' },
          { path: 'district' },
          { path: 'neighborhood' },
        ],
      })
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
    const access_token = this.jwtService.sign(
      {
        _id: auth._id,
        username: auth.username,
        role: auth.role,
      },
      { expiresIn: '15m' },
    );

    const refresh_token = this.jwtService.sign(
      {
        _id: auth._id,
        username: auth.username,
        role: auth.role,
      },
      { expiresIn: '7d' },
    );

    return { inspector, access_token, refresh_token };
  }

  async create(dto: CreateInspectorDto) {
    const { inspector_details, auth_details, workplace } = dto;
    const auth = await this.authService.create(auth_details);

    const photo = await this.fileService.uploadPhoto({
      file: dto.inspector_details?.photo,
      id: uuidv4(),
    });

    const inspector = await this.model.create({
      ...inspector_details,
      auth: auth._id,
      photo,
    });

    const workplaceNew = await this.inspectorWorkplaceService.create({
      ...workplace,
      inspector: inspector._id as string,
    });

    return {
      ...inspector.toObject(),
      workplaces: [workplaceNew],
    };
  }

  async findMe(auth_id: string) {
    return await this.findByAuthId(auth_id);
  }

  async refresh(refresh_token: string) {
    const payload = await this.jwtService.verifyAsync<{
      _id: string;
      username: string;
      role: AuthRoleEnum;
    }>(refresh_token);

    const access_token = this.jwtService.sign({
      _id: payload._id,
      username: payload.username,
      role: payload.role,
    });

    return access_token;
  }
}
