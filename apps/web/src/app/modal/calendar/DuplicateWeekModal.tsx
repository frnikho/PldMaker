import * as React from "react";
import { Slot } from "../../page/calendar/MyCalendarPageComponent";
import { ModalProps } from "../../util/Modal";
import { Button, Modal, NumberInput, RadioButton, RadioButtonGroup } from "carbon-components-react";
import { useForm } from "react-hook-form";

import {Replicate} from '@carbon/icons-react';

import {Stack} from '@carbon/react';
import { DateTime } from "luxon";
import { uniqueId } from "docx";
import { ButtonStyle } from "@pld/ui";

type Props = {
  slots: Slot[];
  window: {
    start: Date,
    end: Date,
  },
} & ModalProps;

enum DuplicateOptions {
  AllMonth,
  AllYear,
  Period,
}

type Form = {
  options: DuplicateOptions;
  period: number,
}

export const DuplicateWeekModal = (props: Props) => {

  const {watch, getValues, setValue} = useForm<Form>({defaultValues: {options: DuplicateOptions.AllMonth, period: 1}});

  const onClickDuplicate = () => {
    const events = props.slots
      .filter((slot) => new Date(slot.start).getTime() >= props.window.start.getTime() && new Date(slot.end).getTime() <= props.window.end.getTime());
    const eventsToAdd: Slot[] = [];
    let valueToStop = 0;
    if (getValues('options') === DuplicateOptions.AllYear) {
      valueToStop = DateTime.fromJSDate(new Date(props.window.start)).endOf('year').get('weekNumber') - DateTime.fromJSDate(new Date(props.window.start)).get('weekNumber');
    } else if (getValues('options') === DuplicateOptions.Period) {
      valueToStop = getValues('period');
    } else if (getValues('options') === DuplicateOptions.AllMonth) {
      valueToStop = DateTime.fromJSDate(new Date(props.window.start)).endOf('month').get('weekNumber') - DateTime.fromJSDate(new Date(props.window.start)).get('weekNumber');
    }
    for (let i = 1; i <= valueToStop; i++) {
      events.forEach((e) => {
        eventsToAdd.push({
          type: e.type,
          start: DateTime.fromJSDate(new Date(e.start)).plus({week: i}).toJSDate(),
          end: DateTime.fromJSDate(new Date(e.end)).plus({week: i}).toJSDate(),
          id: uniqueId(),
        });
      })
    }
    props.onSuccess(eventsToAdd);
  }

  return (
    <Modal passiveModal open={props.open} modalLabel={<p style={{fontWeight: 'bold', fontSize: '1rem'}}>Dupliquer la semaine actuelle</p>} onRequestClose={() => props.onDismiss()}>
      <Stack gap={5}>
        <RadioButtonGroup
          legendText="Options"
          name="radio-button-group"
          valueSelected={watch('options')}
          onChange={(newSelection) => setValue('options', newSelection as unknown as DuplicateOptions)}
          defaultSelected="radio-1">
          <RadioButton
            labelText="Jusqu'à la fin du mois"
            value={DuplicateOptions.AllMonth}
            id="radio-1"
          />
          <RadioButton
            labelText="Jusqu'à la fin de l'année"
            value={DuplicateOptions.AllYear}
            id="radio-2"
          />
          <RadioButton
            labelText="Pendant les X prochaine semaines"
            value={DuplicateOptions.Period}
            id="radio-3"
          />
        </RadioButtonGroup>
        <NumberInput value={watch('period')} onChange={(evt, { value }) => setValue('period', value)} disabled={watch('options') !== DuplicateOptions.Period} id={"interval"} placeholder={"4"} label={"Période"} min={0} helperText={`La semaine actuelle sera dupliquer sur les X prochaine semaines`}/>
        <Button style={ButtonStyle.default} renderIcon={Replicate} disabled={watch('options') === DuplicateOptions.Period && watch('period') <= 0} onClick={onClickDuplicate}>Dupliquer</Button>
      </Stack>
    </Modal>
  );
};
