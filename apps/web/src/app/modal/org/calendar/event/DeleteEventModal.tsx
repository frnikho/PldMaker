import { Modal } from "carbon-components-react";
import { Calendar, CalendarEvent, Organization } from "@pld/shared";
import { ModalProps } from "../../../../util/Modal";
import React, { useCallback, useState } from "react";
import { formatLongDate } from "@pld/utils";
import { LoadingButton } from "../../../../component/utils/LoadingButton";
import { CalendarApiController } from "../../../../controller/CalendarApiController";
import { useAuth } from "../../../../hook/useAuth";
import { errorToast } from "../../../../manager/ToastManager";

type Props = {
  org: Organization;
  calendar: Calendar;
  event: CalendarEvent;
} & ModalProps;

export const DeleteEventModal = (props: Props) => {

  const {accessToken} = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const onClickDelete = useCallback(() => {
    setLoading(true);
    CalendarApiController.deleteEvent(accessToken, props.org._id, props.calendar._id, props.event._id, (event) => {
      if (event) {
        props.onSuccess();
      } else {
        errorToast("Une erreur est survenue lors de la suppression de la réunion !");
      }
      setLoading(false);
    });
  }, [accessToken, props]);

  return (
    <Modal modalLabel={<p style={{fontWeight: 'bold', fontSize: '1rem'}}>Supprimer cette réunion ?</p>} open={props.open} onRequestClose={props.onDismiss} passiveModal>
      <br/>
      <p>{props.event.title}</p>
      <p>créer le {formatLongDate(new Date(props.event.createdDate))}</p>
      <br/>
      <LoadingButton loading={loading} onClick={onClickDelete} kind={"danger"}>Supprimer</LoadingButton>
    </Modal>
  );
};
