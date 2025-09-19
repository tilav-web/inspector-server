import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
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
    try {
      const result = await this.service.login(dto);
      return result;
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(
        "Tizimga kirishda xatolik ketdi. Iltimos birozdan so'ng qayta urinib ko'ring!",
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  async create(@Body() dto: CreateInspectorDto, @Req() req: IRequestCustom) {
    try {
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
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(
        "Inspektor yaratishda xatolik ketdi. Birozdan so'ng qayta urinib ko'ring!",
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async findMe(@Req() req: IRequestCustom) {
    try {
      const auth = req.user;
      const result = await this.service.findMe(auth?._id as string);
      return result;
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(
        "Inspektor yaratishda xatolik ketdi. Birozdan so'ng qayta urinib ko'ring!",
      );
    }
  }
}
