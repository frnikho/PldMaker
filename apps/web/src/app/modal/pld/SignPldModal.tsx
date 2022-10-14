import React from "react";
import {Button, ButtonSet, Modal} from "carbon-components-react";
import { ModalProps } from "../../util/Modal";

export type SignPldModalProps = ModalProps;

export type SignPldModalState = unknown;

export class SignPldModal extends React.Component<SignPldModalProps, SignPldModalState> {

  constructor(props: SignPldModalProps) {
    super(props);
  }

  override render() {
    return (
      <Modal
        size={"md"}
        open={this.props.open}
        passiveModal
        onRequestSubmit={this.props.onSuccess}
        onRequestClose={this.props.onDismiss}
        modalHeading="Signer le pld ?">

        <p>Par la suite, il ne sera plus possible de modifier le PLD ainsi que ses informations (DoDs, états, révisions ..)</p>
        <p>Cependant, vous aurez toujours la possibilité de générer les documents Word de celui-ci</p>
        <br/>
        <br/>
        <ButtonSet>
          <Button kind={"ghost"}>Annuler</Button>
          <Button kind={"ghost"}>Signer</Button>
        </ButtonSet>
      </Modal>
    );
  }
}
