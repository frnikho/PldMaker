import {Body, Controller, Delete, Get, Param, Patch, Post, Request} from '@nestjs/common';
import {NewCalendarBody, Organization} from "@pld/shared";
import {OrganizationPipe} from "../organization.pipe";
import {CalendarService} from "./calendar.service";

@Controller('organization/:orgId/calendar')
export class CalendarController {

  constructor(private calendarService: CalendarService) {}

  @Post('new')
  public async createCalendar(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Body() body: NewCalendarBody) {
    return this.calendarService.createCalendar(req.user._id, org, body);
  }

  @Patch(':calendarId/update')
  public async updateCalendar() {

  }

  @Delete(':calendarId/delete')
  public async deleteCalendar() {

  }

  @Get()
  public async getAllCalendar(@Request() req, @Param('orgId', OrganizationPipe) org: Organization) {
    return this.calendarService.getAllCalendarsFromOrg(req.user._id, org);
  }

  @Get(':calendarId')
  public async getCalendar() {

  }

}
