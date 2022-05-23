import {Logger, VersioningType} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';

import {AppModule} from './app/app.module';
import {NestExpressApplication} from "@nestjs/platform-express";

class Server {

  private app: NestExpressApplication;
  private readonly port: number;

  constructor() {
    this.port = parseInt(process.env.SERVER_PORT, 10) || 3333;
    this.onServerOpened = this.onServerOpened.bind(this);
  }


  public async start(): Promise<void> {
    this.app = await NestFactory.create<NestExpressApplication>(AppModule);
    await this.config();
    await this.app.listen(this.port, this.onServerOpened);
  }

  public async config() {
    this.app.enableVersioning({
      defaultVersion: '1',
      type: VersioningType.URI,
    })
  }

  private onServerOpened() {
    Logger.log(
      `🚀 Application is running on: http://localhost:${this.port}/`
    );
  }
}

new Server().start();
