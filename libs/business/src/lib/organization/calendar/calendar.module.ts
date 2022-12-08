import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import {CalendarHelper} from "./calendar.helper";
import {MongooseModule} from "@nestjs/mongoose";
import {Calendar, CalendarSchema} from "./calendar.model";
import {Organization, OrganizationSchema} from "../organization.schema";
import {CalendarEvent, CalendarEventSchema} from "./calendar_event.model";
import { MailService } from "../../mail/mail.service";
import { MailHelper } from "../../mail/mail.helper";

@Module({
  imports: [MongooseModule.forFeature([{name: Organization.name, schema: OrganizationSchema}, {name: Calendar.name, schema: CalendarSchema}, {name: CalendarEvent.name, schema: CalendarEventSchema}])],
  controllers: [CalendarController],
  providers: [MailService, MailHelper, CalendarService, CalendarHelper]
})
export class CalendarModule {}
