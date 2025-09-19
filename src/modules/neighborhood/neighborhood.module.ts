import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Neighborhood, NeighborhoodSchema } from './neighborhood.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Neighborhood.name, schema: NeighborhoodSchema },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class NeighborhoodModule {}
