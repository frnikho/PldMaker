import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import {CalendarHelper} from "./calendar.helper";
import {MongooseModule} from "@nestjs/mongoose";
import {Calendar, CalendarSchema} from "./calendar.model";
import {Organization, OrganizationSchema} from "../organization.schema";

@Module({
  imports: [MongooseModule.forFeature([{name: Organization.name, schema: OrganizationSchema}, {name: Calendar.name, schema: CalendarSchema}])],
  controllers: [CalendarController],
  providers: [CalendarService, CalendarHelper]
})
export class CalendarModule {}
