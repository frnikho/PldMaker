import { LoggerService } from "@nestjs/common";
import * as log4js from 'log4js';

export class Logger implements LoggerService {

  private logger: log4js.Logger;

  public constructor() {
    this.logger = log4js.getLogger();
    this.logger.level = "ALL";
  }

  error(message: unknown, ...optionalParams: never[]): void {
    log4js.getLogger(optionalParams[0] || "app").error(message);
  }

  log(message: unknown, ...optionalParams: never[]): void {
    log4js.getLogger(optionalParams[0] || "app").info(message);
  }

  warn(message: unknown, ...optionalParams: never[]): void {
    log4js.getLogger(optionalParams[0] || "app").warn(message);
  }

  debug(message: unknown, ...optionalParams: never[]): void {
    log4js.getLogger(optionalParams[0] || "app").debug(message);
  }

}
