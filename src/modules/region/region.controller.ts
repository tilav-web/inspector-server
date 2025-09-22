import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RegionService } from './region.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/auth-roles.decorator';
import { AuthRoleGuard } from '../auth/guards/role.guard';

@Controller('regions')
export class RegionController {
  constructor(private readonly service: RegionService) {}

  @Get(':id')
  @Roles('state', 'region')
  @UseGuards(AuthGuard('jwt'), AuthRoleGuard)
  @UseGuards(AuthGuard('jwt'))
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get()
  @Roles('state')
  @UseGuards(AuthGuard('jwt'), AuthRoleGuard)
  @UseGuards()
  async findAll() {
    return this.service.findAll();
  }
}
