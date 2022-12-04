import * as React from "react";
import { ModalProps } from "../../../util/Modal";
import { Modal, TextArea, TextInput } from "carbon-components-react";
import { useForm } from "react-hook-form";
import { RequiredLabel } from "../../../util/Label";

import {Stack} from '@carbon/react';

import {Add} from '@carbon/icons-react';
import { useCallback, useState } from "react";
import { NewCalendarBody, Organization } from "@pld/shared";
import { validate } from "class-validator";
import { CalendarApiController } from "../../../controller/CalendarApiController";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hook/useAuth";
import { ButtonStyle } from "@pld/ui";
import { LoadingButton } from "../../../component/utils/LoadingButton";

type Props = {
  org: Organization;
} & ModalProps;

type CalendarForm = {
  name: string;
  description: string;
}

export const CreateCalendarModal = (props: Props) => {

  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const {watch, setValue, getValues, setError, formState: {errors}} = useForm<CalendarForm>({defaultValues: {name: '', description: ''}});

  const onClickCreate = useCallback(() => {
    setLoading(true);
    const form = getValues();
    const calendar: NewCalendarBody = new NewCalendarBody(form.name, form.description);
    validate(calendar).then((errors) => {
      if (errors.length > 0) {
        setLoading(false);
        return errors.forEach((err) => {
          const msg = Object.entries(err.constraints ?? {}).map((a) => a[1]);
          setError(err.property as keyof CalendarForm, {message: msg.join(', ')});
        });
      }
      CalendarApiController.createCalendar(accessToken, props.org._id, calendar, (calendar) => {
        if (calendar) {
          toast('Calendrier créer', {type: 'success', icon: '👍'});
          navigate(`/organization/${props.org._id}/calendar/${calendar._id}`);
          props.onSuccess();
        } else {
          toast('Une erreur est survenue', {type: 'error', icon: '❌'});
        }
        setLoading(false);
      });
    });
  }, [getValues, setError, navigate, accessToken, props]);

  return (
    <Modal open={props.open} onRequestClose={() => props.onDismiss()} passiveModal>
      <h2 style={style.title}>Créer un Calendrier</h2>
      <Stack gap={3}>
        <TextInput id={"calendar-title"} value={watch('name')} invalid={errors?.name?.message !== undefined} invalidText={errors?.name?.message} onChange={(e) => setValue('name', e.currentTarget.value)} labelText={<RequiredLabel message={"Nom"}/>}/>
        <TextArea id={"calendar-description"} value={watch('description')} invalid={errors?.description?.message !== undefined} invalidText={errors?.description?.message} onChange={(e) => setValue('description', e.currentTarget.value)} labelText={"Description"}/>
        <LoadingButton loading={loading} style={ButtonStyle.default} renderIcon={Add} onClick={onClickCreate}>Créer</LoadingButton>
      </Stack>
    </Modal>
  );
};

const style = {
  title: {
    marginBottom: '1em',
    fontWeight: 'bold',
  }
}
