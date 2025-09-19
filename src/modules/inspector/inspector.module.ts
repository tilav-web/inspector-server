import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Inspector, InspectorSchema } from './inspector.schema';
import { InspectorService } from './inspector.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { InspectorController } from './inspector.controller';
import { InspectorWorkplaceModule } from '../inspector-workplace/inspector-workplace.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inspector.name, schema: InspectorSchema },
    ]),
    AuthModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    InspectorWorkplaceModule,
  ],
  controllers: [InspectorController],
  providers: [InspectorService, JwtStrategy],
  exports: [InspectorService],
})
export class InspectorModule {}
