import { Modal, TextInput } from "carbon-components-react";
import { formatLongDate } from "@pld/utils";
import { LoadingButton } from "../../../component/utils/LoadingButton";
import React, { useEffect, useState } from "react";
import { ModalProps } from "../../../util/Modal";
import { Calendar, Organization } from "@pld/shared";
import { useForm } from "react-hook-form";
import { RequiredLabel } from "../../../util/Label";
import { CalendarApiController } from "../../../controller/CalendarApiController";
import { useAuth } from "../../../hook/useAuth";
import { errorToast, successToast } from "../../../manager/ToastManager";

type Props = {
  org: Organization;
  calendar: Calendar;
} & ModalProps;

type Form = {
  name: string;
  description: string;
}

export const EditCalendarModal = (props: Props) => {

  const {accessToken} = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const {watch, setValue, getValues} = useForm<Form>({defaultValues: {name: '', description: ''}})

  useEffect(() => {
    setValue('name', props.calendar.name);
    setValue('description', props.calendar.description);
  }, [setValue, props.calendar]);

  const onClickEdit = () => {
    CalendarApiController.updateCalendar(accessToken, props.org._id, props.calendar._id, getValues(), (calendar, error) => {
      if (error) {
        errorToast('Une erreur est survenue !');
      } else if (calendar) {
        successToast('Calendrier mis à jour !');
        props.onSuccess();
      }
    });
  }

  return (
    <Modal modalLabel={<p style={{fontWeight: 'bold', fontSize: '1rem'}}>Modifier ce calendrier ?</p>} open={props.open} onRequestClose={props.onDismiss} passiveModal>
      <br/>
      <TextInput labelText={<RequiredLabel message={"Nom du calendrier"}/>} onChange={(e) => setValue('name', e.currentTarget.value)} value={watch('name')} id={"name"}/>
      <TextInput labelText={"Description du calendrier"} onChange={(e) => setValue('description', e.currentTarget.value)} value={watch('description')} id={"description"}/>
      <br/>
      <p>Créer le {formatLongDate(new Date(props.calendar.createdDate))}</p>
      <br/>
      <LoadingButton loading={loading} onClick={onClickEdit}>Modifier</LoadingButton>
    </Modal>
  );
};
