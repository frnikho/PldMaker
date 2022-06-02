import { Module } from '@nestjs/common';
import { DodController } from './dod.controller';
import {DodService} from "./dod.service";

@Module({
  controllers: [DodController],
  providers: [DodService],
  exports: [DodService, ]
})
export class DodModule {}
