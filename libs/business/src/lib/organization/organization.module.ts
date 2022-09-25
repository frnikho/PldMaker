import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import {MongooseModule} from "@nestjs/mongoose";
import {UserModule} from "../user/user.module";
import {OrganizationListener} from "./organization.listener";
import { CalendarModule } from './calendar/calendar.module';
import { OrganizationHelper } from "./organization.helper";
import { OrganizationDefinition } from "./organization.schema";
import { OrganizationSectionDefinition } from "./section/organization-section.schema";
import { OrganizationSectionHelper } from "./section/organization-section.helper";
import { OrganizationSectionService } from "./section/organization-section.service";
import { DodStatusDefinition } from "../dod/status/dod-status.schema";
import { DodStatusService } from "../dod/status/dod-status.service";
import { DodStatusHelper } from "../dod/status/dod-status.helper";

@Module({
  imports: [MongooseModule.forFeature([DodStatusDefinition, OrganizationDefinition, OrganizationSectionDefinition]), UserModule, CalendarModule],
  controllers: [OrganizationController],
  providers: [OrganizationHelper, OrganizationService, OrganizationListener, OrganizationSectionHelper, OrganizationSectionService, DodStatusService, DodStatusHelper],
  exports: [OrganizationService]
})
export class OrganizationModule {}
