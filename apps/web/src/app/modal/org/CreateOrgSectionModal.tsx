import React from "react";
import { Button, Modal, TextInput } from "carbon-components-react";

import {Stack} from '@carbon/react';
import {Add} from '@carbon/icons-react';
import { OrganizationApiController } from "../../controller/OrganizationApiController";
import { Organization, OrganizationSectionBody } from "@pld/shared";
import { RequiredUserContextProps } from "../../context/UserContext";
import { toast } from "react-toastify";
import { validate } from "class-validator";
import { RequiredLabel } from "../../util/Label";

export type OrgSectionModalProps = {
  open: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
  org: Organization;
  preselectedSection?: string;
} & RequiredUserContextProps;

type Error = {
  [key: string]: string;
}

export type OrgSectionModalState = {
  section: string;
  name: string;
  errors: Error;
};

export class CreateOrgSectionModal extends React.Component<OrgSectionModalProps, OrgSectionModalState> {

  constructor(props: OrgSectionModalProps) {
    super(props);
    this.state = {
      errors: {},
      name: '',
      section: this.props.preselectedSection ?? '',
    }
    this.onClickCreate = this.onClickCreate.bind(this);
  }

  override componentDidUpdate(prevProps: Readonly<OrgSectionModalProps>, prevState: Readonly<OrgSectionModalState>) {
    if (this.props.open && prevProps.open !== this.props.open) {
      this.setState({
        name: '',
        section: this.props.preselectedSection ?? '',
      })
    }
  }

  private onClickCreate(event: any) {
    const body = new OrganizationSectionBody(this.state.section, this.state.name);
    validate(body).then((error) => {
      const obj: Error = {};
      error.forEach((err) => {
        obj[err.property] = Object.values(err.constraints ?? []).join(', ');
      });
      this.setState({errors: obj});
      if (error.length === 0) {
        this.setState({errors: {}});
        OrganizationApiController.createOrgSection(this.props.userContext.accessToken, this.props.org._id, body, (section, error) => {
          if (error) {
            toast(error.message, {type: 'error'});
          } else {
            this.props.onSuccess();
          }
        });
      }
    });
  }

  override render() {
    return (
      <Modal
        size={"sm"}
        open={this.props.open}
        onRequestClose={this.props.onDismiss}
        onRequestSubmit={this.props.onSuccess}
        passiveModal
        modalHeading="Créer une section">
        <Stack gap={6}>
          <Stack gap={2}>
            <TextInput helperText={"la version doit être au format 'X.X' (X doit obligatoirement être un nombre)"} id={"section-input"} invalid={this.state.errors['section'] !== undefined} invalidText={this.state.errors['section']} value={this.state.section} placeholder={"1.2"} labelText={<RequiredLabel message={"Section"}/>} onChange={(e) => this.setState({section: e.currentTarget.value})}/>
            <TextInput helperText={"le nom doit contenir au minimum 3 caractères et maximum 64 caractères."} id={"name-input"} invalid={this.state.errors['name'] !== undefined} invalidText={this.state.errors['name']} value={this.state.name} placeholder={"Reflexion primaire"} labelText={<RequiredLabel message={"Nom"}/>} onChange={(e) => this.setState({name: e.currentTarget.value})}/>
          </Stack>
          <Button renderIcon={Add} onClick={this.onClickCreate}>Créer</Button>
        </Stack>
      </Modal>
    )
  }

}
