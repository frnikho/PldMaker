import * as yaml from 'js-yaml';
import {readFileSync} from "fs";
import {join} from "path";
import {registerAs} from "@nestjs/config";

const CONFIG_FILE = "./assets/config/language.yaml"

export default registerAs('language', () => {
  return yaml.load(readFileSync(join(__dirname, CONFIG_FILE), 'utf-8')) as Record<string, any>
});
