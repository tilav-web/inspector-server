import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InspectorService } from './inspector.service';
import { CreateInspectorDto } from './dto/create-inspector.dto';
import { type IRequestCustom } from 'src/interfaces/request-custom.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('inspectors')
export class InspectorController {
  constructor(private readonly service: InspectorService) {}

  @Post('/login')
  async login(@Body() dto: { username: string; password: string }) {
    const result = await this.service.login(dto);
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  async create(@Body() dto: CreateInspectorDto, @Req() req: IRequestCustom) {
    const auth = req.user;
    if (!auth)
      throw new UnauthorizedException(
        "Bu so'rov uchun tizimga kirishingiz kerak",
      );
    return await this.service.create({
      ...dto,
      auth_details: {
        ...dto.auth_details,
        auth_id: auth?._id,
      },
    });
  }
}
