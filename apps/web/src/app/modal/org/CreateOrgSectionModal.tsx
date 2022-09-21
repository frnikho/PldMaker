import React from "react";
import { Button, Modal, TextInput } from "carbon-components-react";

import {Stack} from '@carbon/react';
import {Add} from '@carbon/icons-react';
import { OrganizationApiController } from "../../controller/OrganizationApiController";
import { Organization, OrganizationSectionBody } from "@pld/shared";
import { RequiredUserContextProps } from "../../context/UserContext";
import { toast } from "react-toastify";

export type OrgSectionModalProps = {
  open: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
  org: Organization;
  preselectedSection?: string;
} & RequiredUserContextProps;

export type OrgSectionModalState = {
  section: string;
  name: string;
};

export class CreateOrgSectionModal extends React.Component<OrgSectionModalProps, OrgSectionModalState> {

  constructor(props: OrgSectionModalProps) {
    super(props);
    this.state = {
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
    OrganizationApiController.createOrgSection(this.props.userContext.accessToken, this.props.org._id, body, (section, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      } else {
        this.props.onSuccess();
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
            <TextInput id={"section-input"} value={this.state.section} placeholder={"1.2"} labelText={"Section"} onChange={(e) => this.setState({section: e.currentTarget.value})}/>
            <TextInput id={"name-input"} value={this.state.name} placeholder={"User"} labelText={"Nom"} onChange={(e) => this.setState({name: e.currentTarget.value})}/>
          </Stack>
          <Button renderIcon={Add} onClick={this.onClickCreate}>Créer</Button>
        </Stack>
      </Modal>
    )
  }

}
