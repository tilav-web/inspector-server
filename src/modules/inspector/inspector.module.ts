import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Inspector, InspectorSchema } from './inspector.schema';
import { InspectorService } from './inspector.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inspector.name, schema: InspectorSchema },
    ]),
  ],
  controllers: [],
  providers: [InspectorService],
  exports: [InspectorService],
})
export class InspectorModule {}
