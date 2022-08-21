import React from "react";
import {Modal, Select, SelectItem} from "carbon-components-react";
import {ModalProps} from "../../util/Modal";
import {Pld} from "@pld/shared";
import {FieldData} from "../../util/FieldData";

export type ChangePldTypeProps = {
  pld: Pld;
} & ModalProps;

export type ChangePldTypeState = {
  typeInput: FieldData<string>;
};

export class ChangePldTypeModal extends React.Component<ChangePldTypeProps, ChangePldTypeState> {

  constructor(props: ChangePldTypeProps) {
    super(props);
    this.state = {
      typeInput: {
        value: this.props.pld.currentStep
      }
    }
  }

  override render() {
    return (
      <Modal
        size={"md"}
        open={this.props.open}
        primaryButtonText={"Valider"}
        onSubmit={() => {
          this.props.onSuccess(this.state.typeInput.value);
        }}
        onRequestSubmit={() => this.props.onSuccess(this.state.typeInput.value)}
        onRequestClose={this.props.onDismiss}
        modalHeading="Change le status d'advancement">

        <Select
          id="select-chante-type-modal"
          value={this.state.typeInput.value}
          labelText=""
          invalid={this.state.typeInput.error !== undefined}
          invalidText={this.state.typeInput.error}
          onChange={(e) => this.setState({typeInput: {value: e.currentTarget.value}})}>

          {this.props.pld.steps.map((step, index) => {
            return (
              <SelectItem
                key={index}
                value={step}
                text={step}
              />
            )
          })}
          </Select>
      </Modal>
    );
  }
}
