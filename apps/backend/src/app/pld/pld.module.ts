import { Module } from '@nestjs/common';
import { PldService } from './pld.service';
import { PldController } from './pld.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Pld, PldSchema} from "./pld.schema";
import { DodModule } from './dod/dod.module';

@Module({
  imports: [MongooseModule.forFeature([{name: Pld.name, schema: PldSchema}]), DodModule],
  providers: [PldService],
  controllers: [PldController],
  exports: [PldService]
})
export class PldModule {}
