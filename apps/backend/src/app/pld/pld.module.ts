import { Module } from '@nestjs/common';
import { PldService } from './pld.service';
import { PldController } from './pld.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Pld, PldSchema} from "./pld.schema";

@Module({
  imports: [MongooseModule.forFeature([{name: Pld.name, schema: PldSchema}])],
  providers: [PldService],
  controllers: [PldController],
  exports: [PldService]
})
export class PldModule {}
