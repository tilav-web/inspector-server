import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { InspectorModule } from './modules/inspector/inspector.module';
import { RegionModule } from './modules/region/region.module';
import { DistrictModule } from './modules/district/district.module';
import { NeighborhoodModule } from './modules/neighborhood/neighborhood.module';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URL'),
      }),
    }),
    InspectorModule,
    RegionModule,
    DistrictModule,
    NeighborhoodModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
