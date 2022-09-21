import React from "react";
import { Button, ButtonSet, Modal, TextInput } from "carbon-components-react";

import {Stack} from '@carbon/react';
import { OrganizationApiController } from "../../controller/OrganizationApiController";
import { Organization, OrganizationSection, OrganizationSectionUpdateBody } from "@pld/shared";
import { RequiredUserContextProps } from "../../context/UserContext";
import { toast } from "react-toastify";

import {TrashCan, Renew} from '@carbon/icons-react';

export type OrgSectionModalProps = {
  open: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
  org: Organization;
  section: OrganizationSection;
} & RequiredUserContextProps;

export type OrgSectionModalState = {
  section: string;
  name: string;
};

export class UpdateOrgSectionModal extends React.Component<OrgSectionModalProps, OrgSectionModalState> {

  constructor(props: OrgSectionModalProps) {
    super(props);
    this.state = {
      section: this.props.section.section,
      name: this.props.section.name,
    }
    this.onClickUpdate = this.onClickUpdate.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  override componentDidUpdate(prevProps: Readonly<OrgSectionModalProps>, prevState: Readonly<OrgSectionModalState>) {
    if (this.props.open && this.props.open !== prevProps.open) {
      this.init();
    }
  }

  private init() {
    this.setState({
      section: this.props.section.section,
      name: this.props.section.name,
    })
  }

  private onClickDelete() {
    OrganizationApiController.deleteOrgSection(this.props.userContext.accessToken, this.props.org._id, this.props.section._id, (section, error) => {
      if (error) {
        toast(error.message[0], {type: 'error'});
      } else {
        this.props.onSuccess();
      }
    });
  }

  private onClickUpdate(event: any) {
    const body = new OrganizationSectionUpdateBody(this.state.name);
    OrganizationApiController.updateOrgSection(this.props.userContext.accessToken, this.props.org._id, this.props.section._id, body, (section, error) => {
      if (error) {
        toast(error.message[0], {type: 'error'});
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
            <TextInput disabled id={"section-input"} value={this.state.section} placeholder={"1.2"} labelText={"Section"}/>
            <TextInput id={"name-input"} placeholder={"User"} labelText={"Nom"} value={this.state.name} onChange={(e) => this.setState({name: e.currentTarget.value})}/>
            <ButtonSet style={{marginTop: 20}}>
              <Button onClick={this.onClickDelete} kind={'danger'} iconDescription={'Supprimer'} renderIcon={TrashCan}>Supprimer</Button>
              <Button onClick={this.onClickUpdate} iconDescription={'Mettre à jour'} renderIcon={Renew}>Mettre à jour</Button>
            </ButtonSet>
          </Stack>
        </form>
      </Modal>
    )
  }

}
