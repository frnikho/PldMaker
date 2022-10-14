import React from "react";
import { Modal, ModalProps as CarbonModalProps } from "carbon-components-react";

export type ModalProps = {
  open: boolean;
  onDismiss: <T,>(args?: T) => void;
  onSuccess: <T,>(args?: T) => void;
};

export abstract class ModalComponent<T, Z> extends React.Component<ModalProps & T, Z> {

  protected constructor(props: ModalProps & T, private params?: CarbonModalProps) {
    super(props);
  }

  override componentDidUpdate(prevProps: Readonly<ModalProps & T>, prevState: Readonly<Z>) {
    if (this.props.open !== prevProps.open) {
      if (this.props.open) {
        this.onOpen();
      } else {
        this.onClose();
      }
    }
  }

  override render() {
    return (<Modal {...this.params} open={this.props.open} onRequestClose={this.props.onDismiss} >
      {this.renderModal()}
    </Modal>)
  }

  abstract renderModal(): React.ReactNode;

  protected onClose() {

  }

  protected onOpen() {

  }

}
