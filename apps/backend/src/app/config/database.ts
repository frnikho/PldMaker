import * as yaml from 'js-yaml';
import {readFileSync} from "fs";
import {join} from "path";
import {registerAs} from "@nestjs/config";

export const CONFIG_FILE = './assets/config/database.yaml'
export const DATABASE_CONFIG_LABEL = 'database';

export default registerAs(DATABASE_CONFIG_LABEL, () => {
  return yaml.load(readFileSync(join(__dirname, CONFIG_FILE), 'utf-8')) as DatabaseConfig
});

export type DatabaseConfig = {
  applicationName: string;
  maxPoolSize: number;
  minPoolSize: number;
  maxIdleTimeMS: number;
  connectTimeoutMS: number;
  socketTimeoutMS: number;
  retryDelay: number;
}
