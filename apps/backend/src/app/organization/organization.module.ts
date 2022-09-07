import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import {MongooseModule} from "@nestjs/mongoose";
import {UserModule} from "../user/user.module";
import {OrganizationListener} from "./organization.listener";
import { CalendarModule } from './calendar/calendar.module';
import { OrganizationHelper } from "./organization.helper";
import { OrganizationDefinition } from "./organization.schema";

@Module({
  imports: [MongooseModule.forFeature([OrganizationDefinition]), UserModule, CalendarModule],
  controllers: [OrganizationController],
  providers: [OrganizationHelper, OrganizationService, OrganizationListener],
  exports: [OrganizationService]
})
export class OrganizationModule {}
