import { Modal } from "carbon-components-react";
import { Calendar, Organization } from "@pld/shared";
import React, { useCallback, useState } from "react";
import { formatLongDate } from "@pld/utils";
import { ModalProps } from "../../../util/Modal";
import { useAuth } from "../../../hook/useAuth";
import { CalendarApiController } from "../../../controller/CalendarApiController";
import { errorToast } from "../../../manager/ToastManager";
import { LoadingButton } from "../../../component/utils/LoadingButton";

type Props = {
  org: Organization;
  calendar: Calendar;
} & ModalProps;

export const DeleteCalendarModal = (props: Props) => {

  const {accessToken} = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const onClickDelete = useCallback(() => {
    setLoading(true);
    CalendarApiController.deleteCalendar(accessToken, props.org._id, props.calendar._id, (calendar) => {
      if (calendar) {
        props.onSuccess();
      } else {
        errorToast("Une erreur est survenue lors de la suppression du calendrier !");
      }
      setLoading(false);
    });
  }, [accessToken, props]);

  return (
    <Modal modalLabel={<p style={{fontWeight: 'bold', fontSize: '1rem'}}>Supprimer ce calendrier ?</p>} open={props.open} onRequestClose={props.onDismiss} passiveModal>
      <br/>
      <p>{props.calendar.name}</p>
      <p>{props.calendar.description}</p>
      <p>créer le {formatLongDate(new Date(props.calendar.createdDate))}</p>
      <br/>
      <LoadingButton loading={loading} onClick={onClickDelete} kind={"danger"}>Supprimer</LoadingButton>
    </Modal>
  );
};
