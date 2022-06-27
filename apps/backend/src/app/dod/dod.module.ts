import { Module } from '@nestjs/common';
import { DodController } from './dod.controller';
import {DodService} from "./dod.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Dod, DodSchema} from "./dod.schema";
import {DodListener} from "./dod.listener";
import {DodHelper} from "./dod.helper";

@Module({
  imports: [MongooseModule.forFeature([{name: Dod.name, schema: DodSchema}])],
  controllers: [DodController],
  providers: [DodService, DodListener, DodHelper],
  exports: [DodService]
})
export class DodModule {}
