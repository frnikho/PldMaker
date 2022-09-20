import React from "react";
import { Button, Modal, TextInput } from "carbon-components-react";

import {Stack} from '@carbon/react';
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

export type OrgSectionModalState = unknown;

export class CreateOrgSectionModal extends React.Component<OrgSectionModalProps, OrgSectionModalState> {

  constructor(props: OrgSectionModalProps) {
    super(props);
    this.onClickCreate = this.onClickCreate.bind(this);
  }

  private onClickCreate(event: any) {
    const elements = event.currentTarget.form?.elements;
    const body = new OrganizationSectionBody(elements[0].value, elements[1].value);
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
        <form>
          <Stack gap={3}>
            <TextInput id={"section-input"} defaultValue={this.props.preselectedSection} placeholder={"1.2"} labelText={"Section"}/>
            <TextInput id={"name-input"} placeholder={"User"} labelText={"Nom"}/>
            <Button onClick={this.onClickCreate}>Créer</Button>
          </Stack>
        </form>
      </Modal>
    )
  }

}
