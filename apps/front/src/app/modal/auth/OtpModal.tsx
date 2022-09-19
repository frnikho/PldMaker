import React from "react";
import { Modal } from "carbon-components-react";
import { RequiredUserContextProps } from "../../context/UserContext";

export type OtpLoginModalProps = {
  open: boolean;
  hide: (show) => void;
} & RequiredUserContextProps;

export type OtpLoginModalState = {

}

export class OtpLoginModal extends React.Component<OtpLoginModalProps, OtpLoginModalState> {

  constructor(props: OtpLoginModalProps) {
    super(props);
  }

  override render() {
    return (
      <Modal
        open={this.props.open}
        passiveModal
        onRequestClose={() => this.props.hide(false)}
        size={"sm"}>
      </Modal>
    )
  }

}
