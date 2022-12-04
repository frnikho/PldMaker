import { Modal } from "carbon-components-react";
import { Calendar, Organization } from "@pld/shared";
import { ModalProps } from "../../../../util/Modal";

type Props = {
  org: Organization;
  calendar: Calendar;
  event: Event;
} & ModalProps;

export const UpdateEventModal = (props: Props) => {
  return (
    <Modal open={props.open} onRequestClose={props.onDismiss} passiveModal>

    </Modal>
  );
};
