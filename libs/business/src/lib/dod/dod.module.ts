import { Module } from '@nestjs/common';
import { DodController } from './dod.controller';
import {DodService} from "./dod.service";
import {MongooseModule} from "@nestjs/mongoose";
import { DodDefinition } from "./dod.schema";
import {DodListener} from "./dod.listener";
import {DodHelper} from "./dod.helper";
import { PldDefinition } from "../pld/pld.schema";
import { OrganizationDefinition } from "../organization/organization.schema";
import { DodStatusHelper } from "./status/dod-status.helper";
import { DodStatusDefinition } from "./status/dod-status.schema";

@Module({
  imports: [MongooseModule.forFeature([OrganizationDefinition, PldDefinition, DodDefinition, DodStatusDefinition])],
  controllers: [DodController],
  providers: [DodService, DodListener, DodHelper, DodStatusHelper],
  exports: [DodService]
})
export class DodModule {}
