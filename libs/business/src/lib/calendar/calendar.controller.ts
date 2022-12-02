import { Body, Request, Controller, Get, Param, Put } from "@nestjs/common";
import { OrganizationPipe } from "../organization/organization.pipe";
import { Organization, SavePersonalCalendar, User } from "@pld/shared";
import { UserPipe } from "../user/user.pipe";
import { CalendarService } from "./calendar.service";

@Controller('calendar')
export class CalendarController {

  constructor(private calendarService: CalendarService) {
  }

  @Put('save')
  public saveCalendar(@Request() req, @Body() body: SavePersonalCalendar) {
    return this.calendarService.saveCalendar(req.user, body);
  }

  @Get()
  public getCalendar(@Request() req) {
    return this.calendarService.getCalendar(req.user);
  }

  @Get('user/:userId')
  public getUserCalendar(@Request() req, @Param('userId', UserPipe) user: User) {
    return this.calendarService.getUserCalendar(req.user, user);
  }

  @Get('org/:orgId')
  public getOrgCalendars(@Request() req, @Param('orgId', OrganizationPipe) org: Organization) {
    return this.calendarService.getOrgCalendars(req.user, org);
  }

}
