import FullCalendar, { DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import interactionPlugin, { EventResizeDoneArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { uniqueId } from "docx";
import { EventDropArg } from "@fullcalendar/core";
import { useAuth } from "../../hook/useAuth";
import { RadioTile, Select, TileGroup, SelectItem, Button, ButtonSet } from "carbon-components-react";
import { EventType, timezones } from "@pld/shared";
import { useStorage } from "../../hook/useStorage";
import { ButtonStyle } from "@pld/ui";

import {Save, Replicate} from '@carbon/icons-react';

import {Stack} from '@carbon/react';
import { PersonalCalendarApiController } from "../../controller/PersonalCalendarApiController";
import { errorToast, successToast } from "../../manager/ToastManager";
import { LoadingButton } from "../../component/utils/LoadingButton";

type Slot = {
  id: string;
  start: Date;
  end: Date;
  type: EventType,
};

type Form = {
  slots: Slot[];
  selectedType: EventType;
  timezone: string;
  options: {
    showTitle: boolean;
    showNowIndicator: boolean;
    showBusinessHours: boolean;
  }
}

type AvailableSlotType = {
  type: EventType;
  color: string;
}

type MyCalendarPreferences = {
  timezone: string;
  showTitle: boolean;
  showNowIndicator: boolean;
  showBusinessHours: boolean;
  slots: Slot[];
}

const AvailableSlotsType: AvailableSlotType[] = [
  {
    color: '#2ecc71',
    type: EventType.Available,
  },
  {
    color: '#797979',
    type: EventType.Busy,
  }
]

export const MyCalendarPageComponent = () => {

  const {accessToken} = useAuth();
  const calendar = useRef<FullCalendar | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const {setItem, getItem} = useStorage<MyCalendarPreferences>();
  const {getValues, setValue, watch} = useForm<Form>({defaultValues: {slots: [], selectedType: EventType.Available, timezone: 'Europe/Paris'}});

  const getEvents = useCallback(() => {
    console.log('abc');
    PersonalCalendarApiController.getCalendar(accessToken, (calendar) => {
      if (calendar?.events) {
        setValue('slots', calendar?.events);
      }
      setLoading(false);
    });
  }, [accessToken, setValue]);

  useEffect(() => {
    const timezone = getItem('timezone');
    if (timezone === null) {
      setItem('timezone', getValues('timezone'));
    } else {
      setValue('timezone', timezone);
    }
    getEvents();
  }, [getItem, setItem, getEvents, getValues, setValue]);

  const onSelectSlot = (event: DateSelectArg) => {
    const array = getValues('slots');
    array.push(({
      id: uniqueId(),
      start: event.start,
      end: event.end,
      type: getValues('selectedType'),
    }));
    setValue('slots', array);
    setItem('slots', array);
  }

  const onDragEvent = (event: EventDropArg) => {
    const slots = watch('slots');
    const slot = slots.find((a) => a.id === event.event.id);
    if (slot === undefined)
      return;
    slot.start = event.event.start!;
    slot.end = event.event.end!;
    setValue('slots', slots);
    setItem('slots', watch('slots'));
  }

  const onResizeEvent = (event: EventResizeDoneArg) => {
    const slot = watch('slots').find((a) => a.id === event.event.id);
    if (slot === undefined)
      return;
    const startDelta = event.startDelta;
    const endDelta = event.endDelta;
    if (slot.start instanceof Date)
      slot.start.setTime(slot.start.getTime() + startDelta.milliseconds);
    if (slot.end instanceof Date)
      slot.end.setTime(slot.end.getTime() + endDelta.milliseconds);
    setItem('slots', watch('slots'));
  }

  const onClickEvent = async (event: EventClickArg) => {
    const slots = watch('slots');
    const index = watch('slots').findIndex((a) => a.id === event.event.id);
    slots.splice(index, 1);
    setValue('slots', slots);
    setItem('slots', slots);
  }

  const events = (): EventInput[] => {
    return watch('slots').map((slot) => {
      const type = AvailableSlotsType.find((a) => slot.type === a.type || slot.type === EventType[a.type]);
      return {
        color: type?.color,
        backgroundColor: type?.color,
        title: type?.type,
        overlap: false,
        ...slot,
      }
    });
  }

  const onChangeTimeZone = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('timezone', event.currentTarget.value);
    setItem('timezone', event.currentTarget.value);
  }

  const onSave = () => {
    setLoading(true);
    PersonalCalendarApiController.saveCalendar(accessToken, {events: getValues('slots')}, (calendar, error) => {
      if (error) {
        errorToast('Une erreur est survenue !');
      } else {
        successToast('Vos disponibilités ont été enregistré');
      }
      setLoading(false);
    });
  }

  const onDuplicate = () => {
    console.log(calendar.current?.getApi().view.currentStart);
    console.log(calendar.current?.getApi().view.currentEnd);
  }

  return (
    <Stack gap={4}>
      <h1 style={{fontWeight: 'bold'}}>Mon calendrier</h1>
      <Select inline id="select-1" value={watch('timezone')} labelText={"Fuseau horaire actuel"} onChange={onChangeTimeZone}>
        {timezones.map((key, index) => <SelectItem
          key={index}
          value={key}
          text={key}
        />)}
      </Select>
      <TileGroup
        defaultSelected="default-selected"
        valueSelected={watch('selectedType')}
        name="radio tile group"
        onChange={(value, name, event) => {
          setValue('selectedType', value as EventType);
        }}>
        {AvailableSlotsType.map((type, index) => {
          return (
            <RadioTile value={type.type} key={index}>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <div className="square" style={{
                  marginRight: 18,
                  height: '30px',
                  width: '30px',
                  marginLeft: 18,
                  backgroundColor: type.color,
                  borderRadius: '50%',
                  display: 'inline-block',
                }}/>
                <p style={{fontWeight: 'bold'}}>{type.type}</p>
              </div>
            </RadioTile>
          )
        })}
      </TileGroup>
      <FullCalendar
        ref={calendar}
        firstDay={1}
        allDaySlot={false}
        businessHours={{
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          startTime: '08:00',
          endTime: '20:00',
        }}
        events={(arg, successCallback) => {
          successCallback(events());
        }}
        selectable={true}
        timeZone={watch('timezone')}
        editable={true}
        eventOverlap={false}
        selectOverlap={false}
        dateClick={(arg) => {console.log(arg)}}
        eventResizableFromStart
        eventDrop={onDragEvent}
        eventClick={onClickEvent}
        eventResize={onResizeEvent}
        select={onSelectSlot}
        scrollTime={'12:00:00'}
        aspectRatio={2}
        slotEventOverlap={false}
        nowIndicator={true}
        locale={'fr'}
        plugins={[dayGridPlugin, momentTimezonePlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
      />
      <ButtonSet style={{gap: 10}}>
        <LoadingButton loading={loading} style={ButtonStyle.default} onClick={onSave} renderIcon={Save}>Sauvegarder</LoadingButton>
        <Button disabled style={ButtonStyle.default} renderIcon={Replicate} onClick={onDuplicate}>Dupliquer la semaine actuel</Button>
      </ButtonSet>
    </Stack>
  );
};
