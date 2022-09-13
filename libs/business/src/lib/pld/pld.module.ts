import { Module } from '@nestjs/common';
import { PldService } from './pld.service';
import { PldController } from './pld.controller';
import {MongooseModule} from "@nestjs/mongoose";
import { PldDefinition } from "./pld.schema";
import { DodModule } from '../dod/dod.module';
import {PldListener} from "./pld.listener";
import {PldHelper} from "./pld.helper";
import { OrganizationDefinition } from "../organization/organization.schema";

@Module({
  imports: [MongooseModule.forFeature([OrganizationDefinition, PldDefinition]), DodModule],
  providers: [PldService, PldListener, PldHelper],
  controllers: [PldController],
  exports: [PldService]
})
export class PldModule {}
