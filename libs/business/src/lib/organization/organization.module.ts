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

@Module({
  imports: [MongooseModule.forFeature([OrganizationDefinition, OrganizationSectionDefinition]), UserModule, CalendarModule],
  controllers: [OrganizationController],
  providers: [OrganizationHelper, OrganizationService, OrganizationListener, OrganizationSectionHelper, OrganizationSectionService],
  exports: [OrganizationService]
})
export class OrganizationModule {}
