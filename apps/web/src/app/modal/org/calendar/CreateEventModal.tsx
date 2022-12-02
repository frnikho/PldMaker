import * as React from "react";
import { Modal } from "carbon-components-react";
import { ModalProps } from "../../../util/Modal";

export const CreateEventModal = (props: ModalProps) => {
  return (
    <Modal passiveModal size={"lg"} open={props.open} onRequestClose={() => props.onDismiss()}>
      <h4 style={{fontWeight: 'bold'}}>Créer un nouvel événement</h4>
    </Modal>
  );
};
