import { Module } from '@nestjs/common';

import {MongooseModule, MongooseModuleFactoryOptions} from "@nestjs/mongoose";
import {LoggerModule} from "./logger/logger.module";
import {EventEmitterModule} from "@nestjs/event-emitter";
import { AuthModule, OrganizationModule, PldModule, UserModule, JwtAuthGuard, TemplateModule, DocumentModule, GatewayModule, MfaGuard, MfaHelper, MfaSchema, AlertModule } from "@pld/business";
import { MfaService } from "@pld/business";
import { JwtModule } from "@nestjs/jwt";

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
    JwtModule.registerAsync({
      useFactory: () => {
        return ({
          secret: process.env.JWT_SECRET,
        })
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
    AlertModule,
    MongooseModule.forFeature([{name: 'Mfa', schema: MfaSchema}]),
  ],
  controllers: [],
  providers: [
    MfaService,
    MfaHelper,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: MfaGuard,
    }
  ],
})
export class AppModule {}
