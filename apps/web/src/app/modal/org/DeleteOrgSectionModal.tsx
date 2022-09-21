import React from "react";
import { Button, ButtonSet, Modal } from "carbon-components-react";

import { Organization, OrganizationSection } from "@pld/shared";
import { RequiredUserContextProps } from "../../context/UserContext";

export type OrgSectionModalProps = {
  open: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
  org: Organization;
  section: OrganizationSection;
} & RequiredUserContextProps;

export type OrgSectionModalState = unknown;

export class DeleteOrgSectionModal extends React.Component<OrgSectionModalProps, OrgSectionModalState> {

  constructor(props: OrgSectionModalProps) {
    super(props);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  private onClickDelete(event: any) {
    /*const elements = event.currentTarget.form?.elements;
    const body = new OrganizationSectionUpdateBody(elements[0].value);
    OrganizationApiController.updateOrgSection(this.props.userContext.accessToken, this.props.org._id, this.props.section._id, body, (section, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      } else {
        this.props.onSuccess();
      }
    });*/
  }

  override render() {
    return (
      <Modal
        size={"sm"}
        open={this.props.open}
        onRequestClose={this.props.onDismiss}
        onRequestSubmit={this.props.onSuccess}
        passiveModal
        modalHeading={`Supprimer la section '${this.props.section.section}' ?`}>
        <ButtonSet>
          <Button>Annuler</Button>
          <Button kind={'danger'}>Supprimer</Button>
        </ButtonSet>
      </Modal>
    )
  }

}
