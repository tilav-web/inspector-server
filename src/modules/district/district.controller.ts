import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DistrictService } from './district.service';
import { Roles } from '../auth/decorators/auth-roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AuthRoleGuard } from '../auth/guards/role.guard';

@Controller('districts')
export class DistrictController {
  constructor(private readonly service: DistrictService) {}

  @Get(':id')
  @Roles('state', 'region', 'district')
  @UseGuards(AuthGuard('jwt'), AuthRoleGuard)
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('/region/:id')
  @Roles('state', 'region')
  @UseGuards(AuthGuard('jwt'))
  async findByRegion(@Param('id') id: string) {
    return this.service.findByRegion(id);
  }

  @Get()
  @Roles('state')
  @UseGuards(AuthGuard('jwt'), AuthRoleGuard)
  async findAll() {
    return this.service.findAll();
  }
}
