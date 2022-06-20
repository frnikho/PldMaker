import React from "react";
import {ModalProps} from "../../util/Modal";
import {Modal, TextInput} from "carbon-components-react";
import {FieldData} from "../../util/FieldData";

import {Stack} from '@carbon/react';
import Material from "@uiw/react-color-material";
import Wheel from "@uiw/react-color-wheel";

type NewOrgDodColorProps = unknown & ModalProps;

type NewOrgDodColorsState = {
  color: FieldData<string>;
  name: FieldData<string>;
}

export class NewOrgDodColorModal extends React.Component<NewOrgDodColorProps, NewOrgDodColorsState> {

  constructor(props: NewOrgDodColorProps) {
    super(props);
    this.state = {
      color: {
        value: '37D67A'
      },
      name: {
        value: ''
      }
    }
  }

  override render() {
    return (
      <Modal
        size={"sm"}
        open={this.props.open}
        primaryButtonText={"Créer"}
        onRequestSubmit={() => {
          this.props.onSuccess(this.state.name.value, this.state.color.value);
          console.log('abcd')
        }}
        onRequestClose={this.props.onDismiss}
        modalHeading="Nouvelle Etat">

        <Stack gap={3}>

          <TextInput id={""}
                     labelText={"Nom"}
                     value={this.state.name.value}
                     onChange={(e) => {
                       this.setState({
                         name: {
                           value: e.currentTarget.value,
                         }
                       })
                     }}

          />
          <Stack orientation={"horizontal"}>
            <Material
              style={{margin: 'auto'}}
              color={this.state.color.value}
              onChange={(color) => {
                this.setState({
                  color: {
                    value: color.hex.slice(1, 7),
                  }
                })
              }}
            />
            <Wheel
              style={{margin: 'auto'}}
              color={this.state.color.value}
              onChange={(color) => {
                this.setState({
                  color: {
                    value: color.hex.slice(1, 7),
                  }
                })
              }}
            />
          </Stack>
        </Stack>
      </Modal>
    );
  }

}
