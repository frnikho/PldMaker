import React from "react";
import {ModalComponentProps} from "../../util/Modal";
import {Modal, TextInput} from "carbon-components-react";
import {FieldData} from "../../util/FieldData";

import {Stack} from '@carbon/react';
import Material from "@uiw/react-color-material";
import Wheel from "@uiw/react-color-wheel";
import { OrganizationApiController } from "../../controller/OrganizationApiController";
import { toast } from "react-toastify";
import { RequiredUserContextProps } from "../../context/UserContext";
import { Organization } from "@pld/shared";

type NewOrgDodColorProps = {
  org: Organization;
} & RequiredUserContextProps & ModalComponentProps;

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

  private onClickCreate() {
    /*if (this.props.org.dodColors.some((a) => a.name.toLowerCase() === this.state.name.value.toLowerCase())) {
      toast('Un status avec ce même nom existe deja !', {type: 'error'})
      return;
    }*/
    /*this.props.org.dodColors.push({
      name: this.state.name.value,
      color: this.state.color.value,
    });
    console.log(this.state);
    OrganizationApiController.updateOrg(this.props.userContext.accessToken, {
      orgId: this.props.org._id,
      dodColors: this.props.org.dodColors,
    }, (org, error) => {
      console.log(org, error);
      if (error) {
        toast(error.message, {type: 'error'});
      } else {
        this.props.onSuccess();
      }
    })*/
  }

  override render() {
    return (
      <Modal
        size={"sm"}
        open={this.props.open}
        primaryButtonText={"Créer"}
        onRequestSubmit={() => {
          this.onClickCreate();
        }}
        onRequestClose={this.props.onDismiss}
        modalHeading="Nouveau status">
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
