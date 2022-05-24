import { Injectable } from '@nestjs/common';
import {LANGUAGE_CONFIG_LABEL, LanguageConfig} from "./language";
import {ConfigService} from "@nestjs/config";
import {DATABASE_CONFIG_LABEL, DatabaseConfig} from "./database";

@Injectable()
export class ConfigFilesService {

  constructor(private configService: ConfigService) {
  }

  public getLanguage(): LanguageConfig {
    return this.configService.get<LanguageConfig>(LANGUAGE_CONFIG_LABEL);
  }

  public getDatabase(): DatabaseConfig {
    return this.configService.get<DatabaseConfig>(DATABASE_CONFIG_LABEL);
  }

}
