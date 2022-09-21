import { Module } from '@nestjs/common';
import { DodController } from './dod.controller';
import {DodService} from "./dod.service";
import {MongooseModule} from "@nestjs/mongoose";
import { DodDefinition } from "./dod.schema";
import {DodListener} from "./dod.listener";
import {DodHelper} from "./dod.helper";
import { PldDefinition } from "../pld/pld.schema";
import { OrganizationDefinition } from "../organization/organization.schema";
import { IsUserAlreadyExistConstraint } from "./dod.rule";

@Module({
  imports: [MongooseModule.forFeature([OrganizationDefinition, PldDefinition, DodDefinition])],
  controllers: [DodController],
  providers: [DodService, DodListener, DodHelper, IsUserAlreadyExistConstraint],
  exports: [DodService]
})
export class DodModule {}
