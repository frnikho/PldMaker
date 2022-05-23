import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule, MongooseModuleFactoryOptions} from "@nestjs/mongoose";
import language from "./config/language";
import server from "./config/server";
import database, {DatabaseConfig} from "./config/database";
import { DATABASE_CONFIG_LABEL } from "./config/database";
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { SettingsController } from './settings/settings.controller';
import { SettingsModule } from './settings/settings.module';
import { OrganizationModule } from './organization/organization.module';

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
          ...configService.get<DatabaseConfig>(DATABASE_CONFIG_LABEL),
          uri: `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`
        };
      }
    }),
    UserModule,
    SettingsModule,
    OrganizationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
