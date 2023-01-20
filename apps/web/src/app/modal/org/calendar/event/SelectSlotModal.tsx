import * as React from "react";
import { Checkbox, Modal, MultiSelect, Select, SelectItem } from "carbon-components-react";
import { ModalProps } from "../../../../util/Modal";
import { useAuth } from "../../../../hook/useAuth";
import { useEffect, useState } from "react";
import { PersonalCalendarApiController } from "../../../../controller/PersonalCalendarApiController";
import { EventType, Organization, PersonalCalendar, timezones } from "@pld/shared";
import dayGridPlugin from "@fullcalendar/daygrid";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import FullCalendar, { EventInput } from "@fullcalendar/react";

import { useForm } from "react-hook-form";

import {Stack} from '@carbon/react';

export type CreateEventModalProps = {
  org: Organization;
} & ModalProps;

enum ShowType {
  All,
  Available,
  Busy,
}

export type Form = {
  timezone: string;
  show: ShowType;
  members: string[];
  onlyBusinessHours: boolean;
}

const colors = [ '#1abc9c', '#16a085', '#2ecc71', '#27ae60', '#3498db', '#2980b9', '#9b59b6', '#8e44ad', '#34495e', '#2c3e50', '#f1c40f', '#f39c12', '#e67e22', '#d35400', '#e74c3c', '#c0392b', '#ecf0f1', '#bdc3c7', '#95a5a6', '#7f8c8d'];

export const SelectSlotModal = (props: CreateEventModalProps) => {

  const {accessToken} = useAuth();
  const [calendars, setCalendars] = useState<PersonalCalendar[]>([]);
  const {watch, setValue, getValues} = useForm<Form>({defaultValues: {onlyBusinessHours: true, timezone: 'Europe/Paris', show: ShowType.Available, members: [props.org.owner._id, ...props.org.members.map((u) => u._id)]}});

  useEffect(() => {
    PersonalCalendarApiController.getOrgMembersCalendars(accessToken, props.org._id, (calendars) => {
      if (calendars) {
        setCalendars(calendars);
      }
    });
  }, [accessToken, props.org]);

  const events = (): EventInput[] => {
    return calendars
      .filter((cal) => getValues('members').some((a) => a === cal.owner._id))
      .map((calendar, index) => {
        const calEvents: EventInput[] = calendar.events.filter((e) => {
          const show = getValues('show')
          if (show === ShowType.Busy) {
            return e.type === EventType.Busy;
          } else if (show === ShowType.Available) {
            return e.type === EventType.Available;
          }
          return e;
        }).map((event) => {
          return {
            color: event.type === EventType.Available ? colors[index] : '#797979',
            start: event.start,
            end: event.end,
            id: event.id,
            title: `${calendar.owner.firstname} ${calendar.owner.lastname.substring(0, 1).toUpperCase()}`,
          }
        });
      return calEvents;
    }).flat();
  }

  const onClickSlot = (date: DateClickArg) => {
    props.onSuccess(date.date);
  }

  const onChangeTimeZone = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('timezone', event.currentTarget.value);
  }

  const onChangeShow = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('show', ShowType[event.currentTarget.value]);
    console.log(event.currentTarget.value);
    console.log(typeof event.currentTarget.value);
  }

  return (
    <Modal modalLabel={<p style={{fontWeight: 'bold', fontSize: '1rem'}}>Selection d'un créneaux</p>} passiveModal size={"lg"} open={props.open} onRequestClose={() => props.onDismiss()}>
      <Stack gap={3}>
        <Select inline id="select-timezone" value={watch('timezone')} labelText={"Fuseau horaire actuel: "} onChange={onChangeTimeZone}>
          {timezones.map((key, index) => <SelectItem
            key={index}
            value={key}
            text={key}
          />)}
        </Select>
        <Select inline id="select-show" value={ShowType[watch('show')]} labelText={"Filtrer les créneaux par: "} onChange={onChangeShow}>
          <SelectItem key={ShowType.All} text={"Tout les créneaux"} value={'All'}/>
          <SelectItem key={ShowType.Busy} text={"Créneaux occupés"} value={'Busy'}/>
          <SelectItem key={ShowType.Available} text={"Créneaux disponibles"} value={'Available'}/>
        </Select>
        <MultiSelect
          label={[...props.org.members, props.org.owner].filter((u) => getValues('members').some((m) => u._id === m)).map((a) => `${a.firstname} ${a.lastname}`).join(', ')}
          id="carbon-multiselect-example"
          titleText="Afficher le calendriers des utilisateurs: "
          items={[...props.org.members, props.org.owner]}
          itemToString={(user) => (`${user.firstname} ${user.lastname} (${user.domain.join(', ')})`)}
          selectionFeedback="top-after-reopen"
          selectedItems={[...props.org.members, props.org.owner].filter((u) => watch('members').some((m) => u._id === m))}
          onChange={({ selectedItems }) => {
            setValue('members', selectedItems.map((u) => u._id));
          }
        }/>
        <Checkbox labelText={`Afficher uniquement les horaires de travail (08h00 - 20h00)`}
                  id="checkbox-label-1"
                  checked={watch('onlyBusinessHours')}
                  onChange={(evt, {checked}) => {setValue('onlyBusinessHours', checked)}}/>
      </Stack>
      <div style={{marginTop: '0.5em'}}>
        <FullCalendar
          firstDay={1}
          allDaySlot={false}
          businessHours={{
            daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
            startTime: '08:00',
            endTime: '20:00',
          }}
          slotMinTime={watch('onlyBusinessHours') ? "08:00:00" : "00:00:00"}
          slotMaxTime={watch('onlyBusinessHours') ? "20:00:00" : "24:00:00"}
          events={(arg, successCallback) => {
            successCallback(events());
          }}
          timeZone={watch('timezone')}
          dateClick={onClickSlot}
          scrollTime={'12:00:00'}
          aspectRatio={2}
          nowIndicator={true}
          expandRows
          locale={'fr'}
          plugins={[dayGridPlugin, momentTimezonePlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
        />
        <div>
          {calendars.map((calendar, index) => {
            return (
              <div key={index} style={{display: 'flex', flexDirection: 'row', gap: '0.5em', marginBottom: '0.2em', marginTop: '0.2em'}}>
                <div className="square" style={{
                  height: '20px',
                  width: '20px',
                  backgroundColor: `${colors[index]}`,
                  borderRadius: '50%',
                  display: 'inline-block',
                }}/>
                <p>{`${calendar.owner.firstname} ${calendar.owner.lastname}`}</p>
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  );
};
