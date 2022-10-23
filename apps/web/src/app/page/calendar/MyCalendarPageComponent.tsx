import FullCalendar, { DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import interactionPlugin, { EventResizeDoneArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { uniqueId } from "docx";
import { EventDropArg } from "@fullcalendar/core";
import { useAuth } from "../../hook/useAuth";
import { RadioTile, Select, TileGroup, SelectItem, Button } from "carbon-components-react";
import { timezones } from "@pld/shared";
import { useStorage } from "../../hook/useStorage";
import { ButtonStyle } from "@pld/ui";

enum SlotType {
  Available = 'Disponible',
  Busy = 'Occupé',
}

type Slot = {
  id: string;
  start: Date;
  end: Date;
  type: SlotType,
};

type Form = {
  slots: Slot[];
  selectedType: SlotType;
  timezone: string;
  options: {
    seeTitle: boolean;
  }
}

type AvailableSlotType = {
  type: SlotType;
  color: string;
}

type MyCalendarPreferences = {
  timezone: string;
  showTitle: boolean;
  slots: Slot[];
}

const AvailableSlotsType: AvailableSlotType[] = [
  {
    color: '#2ecc71',
    type: SlotType.Available,
  },
  {
    color: '#797979',
    type: SlotType.Busy,
  }
  ]

export const MyCalendarPageComponent = () => {

  const {user} = useAuth();
  const {setItem, getItem} = useStorage<MyCalendarPreferences>();
  const {getValues, setValue, watch} = useForm<Form>({defaultValues: {slots: [], selectedType: SlotType.Available, timezone: 'Europe/Paris'}});

  useEffect(() => {
    const timezone = getItem('timezone');
    const slots = getItem<Slot[]>('slots');
    if (timezone === null) {
      setItem('timezone', getValues('timezone'));
    } else {
      setValue('timezone', timezone);
    }
    if (slots !== null) {
      setValue('slots', slots);
    }
  }, []);

  const init = () => {
    const timezone = getItem('timezone');
    if (timezone === null) {
      setItem('timezone', getValues('timezone'));
    } else {
      setValue('timezone', timezone);
    }
  }

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
    console.log(typeof slot.start);
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
      const type = AvailableSlotsType.find((a) => slot.type === a.type || slot.type === SlotType[a.type]);
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

  const onCreate = () => {
  }

  return (
    <>
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
          setValue('selectedType', value as SlotType);
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
        firstDay={1}
        allDaySlot={false}
        events={(arg, successCallback) => {
          successCallback(events());
        }}
        selectable={true}
        timeZone={watch('timezone')}
        editable={true}
        dateClick={(arg) => {console.log(arg)}}
        eventResizableFromStart
        eventDrop={onDragEvent}
        eventOverlap={(stillEvent, movingEvent) => {
          return true;
        }}
        eventClick={onClickEvent}
        eventResize={onResizeEvent}
        select={onSelectSlot}
        locale={'fr'}
        plugins={[ dayGridPlugin, momentTimezonePlugin, timeGridPlugin, interactionPlugin, ]}
        initialView="timeGridWeek"
      />
      <Button style={ButtonStyle.default} onClick={onCreate}>Créer</Button>
    </>
  );
};
