import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Calendar} from "./calendar.model";
import { ObjectIDPipe } from "../../utility/ObjectID.pipe";
import { CalendarEvent } from "./calendar_event.model";

@Injectable()
export class CalendarPipe implements PipeTransform {

  constructor(@InjectModel('Calendar') private calendarModel: Model<Calendar>) {
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    value = new ObjectIDPipe().transform(value, metadata);
    const calendar = await this.calendarModel.findOne({_id: value}).exec();
    if (calendar === null || calendar === undefined)
      throw new BadRequestException('Bad Calendar ID');
    return calendar;
  }
}


@Injectable()
export class CalendarEventPipe implements PipeTransform {

  constructor(@InjectModel('CalendarEvent') private calendarModel: Model<CalendarEvent>) {
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    value = new ObjectIDPipe().transform(value, metadata);
    const calendarEvent = await this.calendarModel.findOne({_id: value}).exec();
    if (calendarEvent === null || calendarEvent === undefined)
      throw new BadRequestException('Bad Calendar ID');
    return calendarEvent;
  }
}
