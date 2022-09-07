import React from "react";
import {Checkbox, DatePicker, DatePickerInput, Modal, MultiSelect, RadioButton, RadioButtonGroup, TextArea, TextInput, TimePicker} from "carbon-components-react";
import {RequiredLabel} from "../../../util/Label";
import {Calendar, NewCalendarEvent, Organization, User} from "@pld/shared";
import {FieldData} from "../../../util/FieldData";
import Circle from "@uiw/react-color-circle";

import {Stack} from '@carbon/react';
import {Deadline} from "@pld/utils";
import {RequiredUserContextProps} from "../../../context/UserContext";
import {validate} from "class-validator";
import {CalendarApiController} from "../../../controller/CalendarApiController";
import { formatDateNumeric } from "../../../util/Date";

type InvitedUser = {
  email: string;
  id: string;
}

export enum NewEventType {
  SIMPLE_EVENT = 'SimpleEvent',
  LONG_EVENT = 'LongEvent',
}

export enum InviteMembersType {
  allMembers = 'ALL',
  someMembers = 'SOME',
}

export enum DayType {
  SINGLE_DAY = 'SINGLE',
  MULTI_DAY = 'MULTI',
}

export type NewEventModalProps = {
  open: boolean;
  onDismiss: () => void;
  type: NewEventType;
  dates: Date[];
  org: Organization;
  calendar: Calendar;
} & RequiredUserContextProps;

export type NewEventModalState = {
  inviteType: InviteMembersType;
  allDay: boolean;
  dayType: DayType;
  invitedUser: FieldData<InvitedUser[]>;
  eventColor: FieldData<string>;
  dates: FieldData<string[]>;
}

export class NewEventModal extends React.Component<NewEventModalProps, NewEventModalState> {

  constructor(props: NewEventModalProps) {
    super(props);
    this.state = {
      inviteType: InviteMembersType.allMembers,
      dayType: this.props.dates.length >= 2 ? DayType.MULTI_DAY : DayType.SINGLE_DAY,
      allDay: false,
      eventColor: {
        value: 'F44E3B',
      },
      invitedUser: {
        value: [],
        loading: false
      },
      dates: {
        value: ['', '']
      }
    }
  }

  override componentDidUpdate(prevProps: Readonly<NewEventModalProps>, prevState: Readonly<NewEventModalState>, snapshot?: any) {
    if (this.props.open && !prevProps.open) {
      this.init();
    }
  }

  private init() {
    this.setState({
      dayType: this.props.dates.length >= 2 ? DayType.MULTI_DAY : DayType.SINGLE_DAY,
      dates: {
        value: [formatDateNumeric(this.props.dates[0]), formatDateNumeric(this.props.dates[1])],
      }
    })
  }

  private createEvent(event) {
    const forms = event.currentTarget.form.elements;
    const title = forms[1].value;
    const description = forms[2].value;
    const dayStart = forms[7].value;
    let deadline: Deadline | undefined;
    let date: Date | undefined;
    console.log(forms);
    if (this.state.dayType === DayType.SINGLE_DAY) {
      if (this.state.allDay) {
        date = new Date(Date.parse(`${dayStart}`))
      } else {
        deadline = {startDate: new Date(Date.parse(`${dayStart}, ${forms[8].value}`)), endDate: new Date(Date.parse(`${dayStart}, ${forms[9].value}`))}
      }
    } else {
      if (this.state.allDay) {
        deadline = {startDate: new Date(Date.parse(dayStart)), endDate: new Date(Date.parse(forms[8].value))}
      } else {
        deadline = {startDate: new Date(Date.parse(`${dayStart}, ${forms[9].value}`)), endDate: new Date(Date.parse(`${forms[8].value}, ${forms[10].value}`))}
      }
    }
    const newEvent: NewCalendarEvent = new NewCalendarEvent(title, description, this.state.invitedUser.value.map((a) => a.id), this.state.eventColor.value, this.state.allDay, this.state.dayType === DayType.MULTI_DAY, date, deadline);
    validate(newEvent).then((errors) => {
      CalendarApiController.createEvent(this.props.userContext.accessToken, this.props.org._id, this.props.calendar._id, newEvent, (calendar, error) => {
        //console.log(calendar, error);
      });
    })
  }

  private showRangeDates() {
    return (
      <DatePicker datePickerType={'range'} id={"date-range"}>
        <DatePickerInput
          id="date-range-start"
          labelText="Date de début"
          placeholder="mm/dd/yyyy"
          value={this.state.dates.value[0]}
          size="md"/>
        <DatePickerInput
          id="date-range-finish"
          labelText="Date de fin"
          placeholder="mm/dd/yyyy"
          value={this.state.dates.value[1]}
          size="md"/>
      </DatePicker>
    )
  }

  private showDates() {
    return (
      <div>{this.state.dayType === DayType.SINGLE_DAY ? <DatePicker datePickerType={'single'} id={"date-simple"}>
        <DatePickerInput
          id="date-simple-start"
          labelText={<RequiredLabel message={!this.state.allDay ? 'Date et heures de l\'évent' : 'Date de l\'évent'}/>}
          placeholder="mm/dd/yyyy"
          value={this.state.dates.value[0]}
          size="md"/>
        </DatePicker> : this.showRangeDates()}
        {!this.state.allDay ? <>
          <TimePicker
            labelText={""}
            style={{marginTop: 10}}
          id="time-picker-a"
          size="sm">
        </TimePicker>
          <TimePicker
            labelText={""}
            id="time-picker-b"
            size="sm">
          </TimePicker>
        </> : null }
      </div>
    )
  }

  override render() {
    return (
      <form>
        <Modal
          open={this.props.open} onRequestClose={this.props.onDismiss} size={'md'} modalLabel={"Nouveau event"} onRequestSubmit={(event) => this.createEvent(event)}>
          <Stack gap={3}>
            <TextInput id={"event-name"} labelText={<RequiredLabel message={"Nom"}/>} placeholder={"Réunion avant Follow-up..."}/>
            <TextArea rows={4} id={"event-description"} labelText={<RequiredLabel message={"Description"}/>} placeholder={"Lien pour rejoindre la réunion: https://...."}/>
            <RadioButtonGroup
              legendText={<RequiredLabel message={"Durée"}/>}
              name="radio-day-type"
              onChange={(newSelection) => this.setState({dayType: newSelection as DayType})}
              valueSelected={this.state.dayType}>
              <RadioButton
                labelText="Une journée"
                value={DayType.SINGLE_DAY}
                id="radio-10"
              />
              <RadioButton
                labelText="Plusieurs Jours"
                value={DayType.MULTI_DAY}
                id="radio-20"
              />
            </RadioButtonGroup>
            <Checkbox id={"all-day-checkbox"} labelText={this.state.dayType === DayType.SINGLE_DAY ? 'Toute la journée' : 'Tout les jours'} checked={this.state.allDay} onChange={(event, {checked}) => this.setState({allDay: checked})}/>
            {this.showDates()}
            <RadioButtonGroup
              legendText={<RequiredLabel message={"Membres"}/>}
              name="radio-button-group"
              onChange={(newSelection) => this.setState({inviteType: newSelection as InviteMembersType})}
              valueSelected={this.state.inviteType}>
              <RadioButton
                labelText="Invitez tout les membres de l'organisation"
                value={InviteMembersType.allMembers}
                id="radio-1"
              />
              <RadioButton
                labelText="Invitez seulement quelques membres"
                value={InviteMembersType.someMembers}
                id="radio-2"
              />
            </RadioButtonGroup>
            <MultiSelect
              onChange={(item) => {
                this.setState({invitedUser: {value: item.selectedItems.map((i) => ({email: i.label, id: i.value}))}})
              }}
              disabled={this.state.inviteType === InviteMembersType.allMembers}
              invalidText={this.state.invitedUser.error}
              invalid={this.state.invitedUser.error !== undefined}
              titleText={"Membres à inviter"}
              items={(this.props.org.members as User[]).concat([this.props.org.owner as User]).map((user) => ({label: user.email, value: user._id}))}
              label={this.state.invitedUser.value.map((a) => a.email).join(', ')}
              id="carbon-multiselect-example"
              selectionFeedback="top-after-reopen"/>
            <Stack gap={4}>
              <RequiredLabel message={"Couleur"}/>
              <Circle
                colors={[ '#1abc9c', '#16a085', '#2ecc71', '#27ae60', '#3498db', '#2980b9', '#9b59b6', '#8e44ad', '#34495e', '#2c3e50', '#f1c40f', '#f39c12', '#e67e22', '#d35400', '#e74c3c', '#c0392b', '#ecf0f1', '#bdc3c7', '#95a5a6', '#7f8c8d']}
                color={`#${this.state.eventColor.value}`}
                onChange={(color) => {
                  this.setState({eventColor: {
                      value: color.hex.slice(1, 7)
                    }})
                }}
              />
            </Stack>
          </Stack>
        </Modal>
      </form>
    )
  }

}
