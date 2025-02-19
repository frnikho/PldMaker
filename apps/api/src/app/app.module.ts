import { Module } from '@nestjs/common';

import {MongooseModule, MongooseModuleFactoryOptions} from "@nestjs/mongoose";
import {LoggerModule} from "./logger/logger.module";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {
  AuthModule,
  OrganizationModule,
  PldModule,
  UserModule,
  JwtAuthGuard,
  TemplateModule,
  DocumentModule,
  GatewayModule,
  MfaGuard,
  MfaHelper,
  MfaSchema,
  AlertModule, PersonalCalendarModule
} from "@pld/business";
import { MfaService } from "@pld/business";
import { JwtModule } from "@nestjs/jwt";
import { DbExceptionFilter } from "./exception/db.filter";
import { ValidationFilter } from "./exception/validation.filter";
import { MailModule } from "@pld/business";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
        port: parseInt(process.env.REDIS_PORT, 10)
      }
    }),
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
    MailModule,
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
    PersonalCalendarModule,
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
    },
    {
      provide: 'APP_FILTER',
      useClass: DbExceptionFilter,
    },
    {
      provide: 'APP_FILTER',
      useClass: ValidationFilter,
    },
  ],
})
export class AppModule {}
