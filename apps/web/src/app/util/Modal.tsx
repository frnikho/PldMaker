import React from "react";
import { Modal, ModalProps } from "carbon-components-react";

export type ModalComponentProps = {
  open: boolean;
  onDismiss: (...args: unknown[]) => void;
  onSuccess: (...args: unknown[]) => void;
};

export abstract class ModalComponent<T, Z> extends React.Component<ModalComponentProps & T, Z> {

  protected constructor(props: ModalComponentProps & T, private params?: ModalProps) {
    super(props);
  }

  override componentDidUpdate(prevProps: Readonly<ModalComponentProps & T>, prevState: Readonly<Z>) {
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
