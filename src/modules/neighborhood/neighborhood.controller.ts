import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { NeighborhoodService } from './neighborhood.service';
import { Roles } from '../auth/decorators/auth-roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AuthRoleGuard } from '../auth/guards/role.guard';

@Controller('neighborhoods')
export class NeighborhoodController {
  constructor(private readonly service: NeighborhoodService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findByID(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('/region/:region/district/:district')
  @Roles('state', 'region', 'district')
  @UseGuards(AuthGuard('jwt'), AuthRoleGuard)
  async findByRegionAndDistrict(
    @Param('region') region: string,
    @Param('district') district: string,
  ) {
    return this.service.findByRegionAndDistrict({ region, district });
  }

  @Get()
  @Roles('state')
  @UseGuards(AuthGuard('jwt'), AuthRoleGuard)
  async findAll() {
    return this.service.findAll();
  }
}
