import React from "react";
import { Button, Modal, TextInput } from "carbon-components-react";

import {Stack} from '@carbon/react';
import { OrganizationApiController } from "../../controller/OrganizationApiController";
import { Organization, OrganizationSection, OrganizationSectionUpdateBody } from "@pld/shared";
import { RequiredUserContextProps } from "../../context/UserContext";
import { toast } from "react-toastify";

export type OrgSectionModalProps = {
  open: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
  org: Organization;
  section: OrganizationSection;
} & RequiredUserContextProps;

export type OrgSectionModalState = unknown;

export class UpdateOrgSectionModal extends React.Component<OrgSectionModalProps, OrgSectionModalState> {

  constructor(props: OrgSectionModalProps) {
    super(props);
    this.onClickUpdate = this.onClickUpdate.bind(this);
  }

  private onClickUpdate(event: any) {
    const elements = event.currentTarget.form?.elements;
    const body = new OrganizationSectionUpdateBody(elements[0].value);
    OrganizationApiController.updateOrgSection(this.props.userContext.accessToken, this.props.org._id, this.props.section._id, body, (section, error) => {
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
        modalHeading={`Mettra a jour la section ${this.props.section.section}`}>
        <form>
          <Stack gap={3}>
            <TextInput disabled id={"section-input"} defaultValue={this.props.section.section} placeholder={"1.2"} labelText={"Section"}/>
            <TextInput id={"name-input"} placeholder={"User"} labelText={"Nom"}/>
            <Button onClick={this.onClickUpdate}>Créer</Button>
          </Stack>
        </form>
      </Modal>
    )
  }

}
