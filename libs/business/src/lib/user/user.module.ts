import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {UserController} from "./user.controller";
import { UserDefinition } from "./user.schema";
import {UserService} from "./user.service";
import { FavourDefinition } from "./favour.schema";
import { UserHelper } from "./user.helper";
import { CalendarService } from "../organization/calendar/calendar.service";
import { CalendarDefinition } from "../organization/calendar/calendar.model";
import { CalendarEventDefinition } from "../organization/calendar/calendar_event.model";
import { CalendarHelper } from "../organization/calendar/calendar.helper";
import { MailService } from "../mail/mail.service";
import { MailHelper } from "../mail/mail.helper";
import { UserConsumer } from "./user.consumer";
import { BullModule } from "@nestjs/bull";
import { DodHelper } from "../dod/dod.helper";
import { DodDefinition } from "../dod/dod.schema";
import { DodStatusDefinition } from "../dod/status/dod-status.schema";
import { DodStatusHelper } from "../dod/status/dod-status.helper";
import { PldDefinition } from "../pld/pld.schema";
import { PldHelper } from "../pld/pld.helper";
import { OrganizationDefinition } from "../organization/organization.schema";
import { OrganizationHelper } from "../organization/organization.helper";
import { DodStatusService } from "../dod/status/dod-status.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        return ({
          secret: process.env.JWT_SECRET,
        })
      }
    }),
    BullModule.registerQueue({name: 'user'}),
    MongooseModule.forFeature([DodDefinition, PldDefinition, DodStatusDefinition, UserDefinition, FavourDefinition, CalendarDefinition, CalendarEventDefinition, OrganizationDefinition]),
  ],
  providers: [MailService, MailHelper, UserHelper, UserService, UserConsumer, CalendarService, CalendarHelper, DodHelper, DodStatusService, DodStatusHelper, PldHelper, OrganizationHelper,],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
