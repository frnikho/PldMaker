import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule, MongooseModuleFactoryOptions} from "@nestjs/mongoose";
import language from "./config/language";
import server from "./config/server";
import database, {DatabaseConfig} from "./config/database";
import { DATABASE_CONFIG_LABEL } from "./config/database";
import { UserModule } from './user/user.module';
import { SettingsModule } from './settings/settings.module';
import { OrganizationModule } from './organization/organization.module';
import { AuthModule } from './auth/auth.module';
import * as autoPopulate from 'mongoose-autopopulate';
import {JwtAuthGuard} from "./auth/guard/jwt-auth.guard";
import {LoggerModule} from "./logger/logger.module";
import { PldModule } from './pld/pld.module';
import { TemplateModule } from './template/template.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [language, server, database],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MongooseModuleFactoryOptions => {
        return {
          connectionFactory: (connection) => {
            connection.plugin(autoPopulate);
            return connection;
          },
          ...configService.get<DatabaseConfig>(DATABASE_CONFIG_LABEL),
          uri: `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`
        };
      }
    }),
    AuthModule,
    SettingsModule,
    UserModule,
    OrganizationModule,
    ConfigModule,
    LoggerModule,
    PldModule,
    TemplateModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: 'APP_GUARD',
    useClass: JwtAuthGuard,
  },],
})
export class AppModule {}
