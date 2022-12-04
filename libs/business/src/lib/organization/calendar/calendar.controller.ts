import {Body, Controller, Delete, Get, Param, Patch, Post, Request} from '@nestjs/common';
import { CalendarEvent, Calendar, NewCalendarBody, NewCalendarEvent, Organization, EventUpdateMemberStatusBody, EventManageMemberBody, EventUpdateBody } from "@pld/shared";
import {CalendarService} from "./calendar.service";
import { CalendarEventPipe, CalendarPipe } from "./calendar.pipe";
import { OrganizationPipe } from "../organization.pipe";

/**
 * @author Nicolas SANS
 * @date 06/09/2022
 */
@Controller('organization/:orgId/calendar')
export class CalendarController {

  constructor(private calendarService: CalendarService) {}

  /**
   * Create a new calendar for the logged user
   * @param req NestJS Request
   * @param org Organization (with pipe)
   * @param calendar Calendar (with pipe)
   * @param body NewCalendarEvent
   */
  @Post(':calendarId/event')
  public async createEvent(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('calendarId', CalendarPipe) calendar: Calendar, @Body() body: NewCalendarEvent) {
    return this.calendarService.createEvent(req.user, org, calendar, body);
  }

  @Get(':calendarId/event')
  public async getEvents(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('calendarId', CalendarPipe) calendar: Calendar) {
    return this.calendarService.getEvents(req.user, org, calendar);
  }

  @Get(':calendarId/event/:eventId')
  public async getEvent(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('calendarId', CalendarPipe) calendar: Calendar, @Param('eventId') eventId: string) {
    return this.calendarService.getEvent(req.user, org, calendar, eventId);
  }

  @Post('new')
  public async createCalendar(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Body() body: NewCalendarBody) {
    return this.calendarService.createCalendar(req.user, org, body);
  }

  @Patch(':calendarId/event/:eventId/member')
  public async updateMemberStatus(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('calendarId', CalendarPipe) calendar: Calendar, @Param('eventId', CalendarEventPipe) event: CalendarEvent, @Body() body: EventUpdateMemberStatusBody) {
    return this.calendarService.updateMemberStatus(req.user, org, calendar, event, body);
  }

  @Post(':calendarId/event/:eventId/member/add')
  public async inviteMemberStatus(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('calendarId', CalendarPipe) calendar: Calendar, @Param('eventId', CalendarEventPipe) event: CalendarEvent, @Body() body: EventManageMemberBody) {
    return this.calendarService.inviteMember(req.user, org, calendar, event, body);
  }

  @Post(':calendarId/event/:eventId/member/revoke')
  public async revokeMemberStatus(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('calendarId', CalendarPipe) calendar: Calendar, @Param('eventId', CalendarEventPipe) event: CalendarEvent, @Body() body: EventManageMemberBody) {
    return this.calendarService.revokeMember(req.user, org, calendar, event, body);
  }

  @Delete(':calendarId/event/:eventId')
  public async deleteEvent(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('calendarId', CalendarPipe) calendar: Calendar, @Param('eventId', CalendarEventPipe) event: CalendarEvent) {
    return this.calendarService.deleteEvent(req.user, org, calendar, event);
  }

  @Patch(':calendarId/event/:eventId')
  public async updateEvent(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('calendarId', CalendarPipe) calendar: Calendar, @Param('eventId', CalendarEventPipe) event: CalendarEvent, @Body() body: EventUpdateBody) {
    return this.calendarService.updateEvent(req.user, org, calendar, event, body);
  }

  @Patch(':calendarId/update')
  public async updateCalendar() {
    //TODO
  }

  @Delete(':calendarId')
  public async deleteCalendar(@Request() req, @Param('orgId', OrganizationPipe) org: Organization, @Param('calendarId', CalendarPipe) calendar: Calendar) {
    return this.calendarService.deleteCalendar(req.user, org, calendar);
  }

  @Get()
  public async getAllCalendar(@Request() req, @Param('orgId', OrganizationPipe) org: Organization) {
    return this.calendarService.getAllCalendarsFromOrg(req.user, org);
  }


  @Get(':calendarId')
  public async getCalendar(@Request() req,  @Param('orgId', OrganizationPipe) org: Organization, @Param('calendarId') calendarId: string) {
    return this.calendarService.getCalendar(req.user, org, calendarId);
  }

}
