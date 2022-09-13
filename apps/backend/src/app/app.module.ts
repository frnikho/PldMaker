import { Module } from '@nestjs/common';

import {MongooseModule, MongooseModuleFactoryOptions} from "@nestjs/mongoose";
import {LoggerModule} from "./logger/logger.module";
import {EventEmitterModule} from "@nestjs/event-emitter";
import { AuthModule, OrganizationModule, PldModule, UserModule, JwtAuthGuard, TemplateModule, DocumentModule, GatewayModule } from "@pld/business";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [],
      useFactory: (): MongooseModuleFactoryOptions => {
        return {
          uri: `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`
        };
      }
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    OrganizationModule,
    LoggerModule,
    PldModule,
    TemplateModule,
    GatewayModule,
    DocumentModule,
  ],
  controllers: [],
  providers: [{
    provide: 'APP_GUARD',
    useClass: JwtAuthGuard,
  }],
})
export class AppModule {}
