import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule, MongooseModuleFactoryOptions} from "@nestjs/mongoose";
import language from "./config/language";
import server from "./config/server";
import database, {DatabaseConfig} from "./config/database";
import { DATABASE_CONFIG_LABEL } from "./config/database";

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
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
