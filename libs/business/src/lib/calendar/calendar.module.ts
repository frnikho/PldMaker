import { Module } from "@nestjs/common";
import { CalendarController } from "./calendar.controller";
import { CalendarService } from "./calendar.service";
import { CalendarHelper } from "./calendar.helper";
import { MongooseModule } from "@nestjs/mongoose";
import { PersonalCalendarDefinition } from "./calendar.model";
import { UserDefinition } from "../user/user.schema";
import { OrganizationDefinition } from "../organization/organization.schema";

@Module({
  imports: [MongooseModule.forFeature([UserDefinition, OrganizationDefinition, PersonalCalendarDefinition])],
  controllers: [CalendarController],
  providers: [CalendarService, CalendarHelper],
  exports: [],
})
export class PersonalCalendarModule {}
