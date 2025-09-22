import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InspectorService, ISearchQuery } from './inspector.service';
import { CreateInspectorDto } from './dto/create-inspector.dto';
import { type IRequestCustom } from 'src/interfaces/request-custom.interface';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { type Response } from 'express';

@Controller('inspectors')
export class InspectorController {
  constructor(private readonly service: InspectorService) {}

  @Post('/login')
  async login(
    @Body() dto: { username: string; password: string },
    @Res() res: Response,
  ) {
    try {
      const { inspector, refresh_token, access_token } =
        await this.service.login(dto);

      return res
        .cookie('refresh_token', refresh_token, {
          httpOnly: process.env.NODE_ENV === 'production',
          secure: true,
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({ inspector, access_token });
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
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() dto: CreateInspectorDto,
    @Req() req: IRequestCustom,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    try {
      const auth = req.user;
      if (!auth)
        throw new UnauthorizedException(
          "Bu so'rov uchun tizimga kirishingiz kerak",
        );
      return await this.service.create({
        ...dto,
        inspector_details: {
          ...dto.inspector_details,
          photo,
        },
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

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async findAll(
    @Req() req: IRequestCustom,
    @Query() dto: ISearchQuery & { page?: number; limit?: number },
  ) {
    try {
      const auth = req.user;
      const result = await this.service.findAll({
        auth_id: auth?._id as string,
        ...dto,
      });
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

  @UseGuards(AuthGuard('jwt'))
  @Get('/by/:id')
  async findById(@Param('id') id: string, @Req() req: IRequestCustom) {
    try {
      const auth = req.user;
      const result = await this.service.findById({
        id,
        auth_id: auth?._id as string,
      });
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

  @Post('/refresh_token')
  async refresh(
    @Req() req: IRequestCustom & { cookies: { refresh_token?: string } },
  ) {
    try {
      const refresh_token = req.cookies['refresh_token'];
      if (!refresh_token) {
        throw new UnauthorizedException('Refresh token not found');
      }

      const result = await this.service.refresh(refresh_token);
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
