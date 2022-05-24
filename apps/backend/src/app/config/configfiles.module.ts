import { Module } from '@nestjs/common';
import {ConfigFilesService} from "./configfiles.service";

@Module({
  imports: [],
  providers: [ConfigFilesService],
  exports: [ConfigFilesService]
})
export class ConfigFilesModule {}
