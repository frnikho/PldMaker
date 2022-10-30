import { PropOptions } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type CalendarRuleType = {
  owner: PropOptions;
  events: PropOptions;
  createdDate: PropOptions;
  updatedDate: PropOptions;
}

export const calendarRule: CalendarRuleType = {
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  events: {
    required: false,
    default: [],
  },
  createdDate: {
    required: false,
    default: new Date(),
  },
  updatedDate: {
    required: false,
    default: new Date()
  }
}
