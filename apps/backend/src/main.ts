import {ValidationPipe, VersioningType} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';

import {AppModule} from './app/app.module';
import {NestExpressApplication} from "@nestjs/platform-express";
import {Logger} from "./app/logger/logger";

class Server {

  private app: NestExpressApplication;
  private readonly port: number;

  constructor() {
    this.port = parseInt(process.env.SERVER_PORT, 10) || 3333;
    this.onServerOpened = this.onServerOpened.bind(this);
  }

  public async start(): Promise<void> {
    this.app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: new Logger(),
    });
    await this.config();
    await this.app.listen(this.port, this.onServerOpened);
  }

  public async config() {
    this.app.enableVersioning({
      defaultVersion: '1',
      type: VersioningType.URI,
    });
    this.app.enableCors({
      origin: process.env.NX_CLIENT_HOST,
    });
    this.app.useGlobalPipes(new ValidationPipe());
  }

  private onServerOpened() {
    new Logger(
    ).log(`Application is running on: http://localhost:${this.port}/`);
  }
}

new Server().start().then(() => {
  console.log('');});
