import { Modal } from "carbon-components-react";
import { Calendar, Organization } from "@pld/shared";
import { ModalProps } from "../../../../util/Modal";
import * as React from "react";

type Props = {
  org: Organization;
  calendar: Calendar;
  event: Event;
} & ModalProps;

export const InviteUserEventModal = (props: Props) => {
  return (
    <Modal modalLabel={<p style={{fontWeight: 'bold', fontSize: '1rem'}}>Invitez des utilisateurs</p>} open={props.open} onRequestClose={props.onDismiss} passiveModal>

    </Modal>
  );
};
