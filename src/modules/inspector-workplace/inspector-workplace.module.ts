import { Module } from '@nestjs/common';
import { InspectorWorkplaceService } from './inspector-workplace.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InspectorWorkplace,
  InspectorWorkplaceSchema,
} from './inspector-workplace.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InspectorWorkplace.name, schema: InspectorWorkplaceSchema },
    ]),
  ],
  controllers: [],
  providers: [InspectorWorkplaceService],
  exports: [InspectorWorkplaceService],
})
export class InspectorWorkplaceModule {}
