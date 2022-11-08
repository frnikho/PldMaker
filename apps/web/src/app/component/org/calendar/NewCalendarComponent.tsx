import React from "react";
import {NewCalendarBody} from "@pld/shared";
import { Breadcrumb, BreadcrumbItem, Button, ButtonSet, DatePicker, DatePickerInput, FormLabel, TextArea, TextInput } from "carbon-components-react";

import {Add} from '@carbon/icons-react';

import {Stack} from '@carbon/react';
import {HelpLabel, RequiredLabel} from "../../../util/Label";
import {Deadline} from "@pld/utils";
import { validate } from "class-validator";
import {CalendarApiController} from "../../../controller/CalendarApiController";
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hook/useAuth";
import { ButtonStyle } from "@pld/ui";
import { useForm } from "react-hook-form";

type Props = {
  orgId: string;
}

type Form = {
  name: string;
  description: string;
  deadline?: Deadline;
}

export const NewCalendarComponent = (props: Props) => {

  const navigate = useNavigate();
  const {accessToken} = useAuth();
  const {watch, setValue, getValues, setError, formState: {errors}} = useForm<Form>({defaultValues: {name: '', description: ''}});

  const onClickCreate = () => {
    const form = getValues();
    const calendar: NewCalendarBody = new NewCalendarBody(form.name, form.description, form.deadline);
    validate(calendar).then((errors) => {
      if (errors.length > 0) {
        return errors.forEach((err) => {
          const msg = Object.entries(err.constraints ?? {}).map((a) => a[1]);
          setError(err.property as keyof Form, {message: msg.join(', ')});
        });
      }
      CalendarApiController.createCalendar(accessToken, props.orgId, calendar, (calendar, error) => {
        if (calendar) {
          toast('Calendrier créer', {type: 'success', icon: '👍'});
          navigate(`/organization/${props.orgId}/calendar/${calendar._id}`);
        } else {
          toast('Une erreur est survenue', {type: 'error', icon: '❌'});
        }
      });
    });
  }

  return (
    <>
      <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
        <BreadcrumbItem onClick={() => navigate('/')}>Dashboard</BreadcrumbItem>
        <BreadcrumbItem onClick={() => navigate(`/organization/${props.orgId}`)}>Organisation</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Calendrier</BreadcrumbItem>
      </Breadcrumb>
      <Stack gap={4}>
        <h2 style={{fontWeight: 'bold'}}>Créer un Calendrier</h2>
        <TextInput id={"calendar-title"} value={watch('name')} invalid={errors?.name?.message !== undefined} invalidText={errors?.name?.message} onChange={(e) => setValue('name', e.currentTarget.value)} labelText={<RequiredLabel message={"Nom"}/>}/>
        <TextArea id={"calendar-description"} value={watch('description')} invalid={errors?.description?.message !== undefined} invalidText={errors?.description?.message} onChange={(e) => setValue('description', e.currentTarget.value)} labelText={"Description"}/>
        <FormLabel>Deadline</FormLabel>
        <DatePicker datePickerType="range" style={{padding: 4}} onChange={(dates) => {
          if (dates.length === 2) {
            setValue('deadline', new Deadline(dates[0], dates[1]));
          } else {
            setValue('deadline', undefined);
          }
        }}>
          <DatePickerInput
            id="date-picker-input-id-start"
            placeholder="mm/dd/yyyy"
            labelText="Start date"
          />
          <DatePickerInput
            id="date-picker-input-id-finish"
            placeholder="mm/dd/yyyy"
            labelText="End date"
          />
        </DatePicker>
        <HelpLabel message={"La deadline d'un calendrier n'est pas obligatoire mais vous permet de vous retrouvez dans l'avancement de votre EIP"}/>
        <ButtonSet style={{marginTop: 10}}>
          <Button style={ButtonStyle.default} renderIcon={Add} iconDescription={"Add"} onClick={onClickCreate}>Créer</Button>
        </ButtonSet>
      </Stack>
    </>
  );
};
