import { DatePicker, DatePickerInput, Modal, TextArea, TextInput } from "carbon-components-react";
import { Calendar, CalendarEvent, Organization } from "@pld/shared";
import { ModalProps } from "../../../../util/Modal";
import { Deadline, formatLongDate } from "@pld/utils";
import { useForm } from "react-hook-form";
import React, { useCallback, useEffect, useState } from "react";
import { RequiredLabel } from "../../../../util/Label";
import { LoadingButton } from "../../../../component/utils/LoadingButton";
import { CalendarApiController } from "../../../../controller/CalendarApiController";
import { useAuth } from "../../../../hook/useAuth";
import { errorToast, successToast } from "../../../../manager/ToastManager";

type Props = {
  org: Organization;
  calendar: Calendar;
  event: CalendarEvent;
} & ModalProps;

type Form = {
  title: string;
  description: string;
}

export const UpdateEventModal = ({ org, event, calendar, open, onSuccess, onDismiss }: Props) => {

  const {accessToken} = useAuth();
  const {watch, setValue, getValues} = useForm<Form>({defaultValues: {title: '', description: ''}})
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setValue('title', event.title);
    setValue('description', event.description);
  }, [event, setValue]);

  const onClickEdit = useCallback(() => {
    setLoading(true);
    CalendarApiController.updateEvent(accessToken, org._id, calendar._id, event._id, {...getValues()}, (event, error) => {
      if (error) {
        errorToast('Une erreur est survenue !');
      } else if (event) {
        successToast('Réunion mise à jour !');
        onSuccess();
      }
      setLoading(false);
    });
  }, [accessToken, event, calendar, org, onSuccess, getValues]);

  return (
    <Modal modalLabel={<p style={{fontWeight: 'bold', fontSize: '1rem'}}>Modifier cette réunion ?</p>} open={open} onRequestClose={onDismiss} passiveModal>
      <br/>
      <TextInput labelText={<RequiredLabel message={"Nom du calendrier"}/>} onChange={(e) => setValue('title', e.currentTarget.value)} value={watch('title')} id={"name"}/>
      <TextArea rows={8} labelText={"Description du calendrier"} onChange={(e) => setValue('description', e.currentTarget.value)} value={watch('description')} id={"description"}/>
      <br/>
      <LoadingButton loading={loading} onClick={onClickEdit}>Modifier</LoadingButton>
    </Modal>
  );
};
