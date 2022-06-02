import * as yaml from 'js-yaml';
import {readFileSync} from "fs";
import {join} from "path";
import {registerAs} from "@nestjs/config";

const CONFIG_FILE = "./assets/config/language.yaml"

export const LANGUAGE_CONFIG_LABEL = 'language';

export default registerAs(LANGUAGE_CONFIG_LABEL, () => {
  return yaml.load(readFileSync(join(__dirname, CONFIG_FILE), 'utf-8')) as Record<string, unknown>
});

export type LanguageConfig = {
  auth: {
    userAlreadyRegistered: string;
    userNotFound: string;
  }
}
