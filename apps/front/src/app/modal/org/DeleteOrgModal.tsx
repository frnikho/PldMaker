import React from "react";
import { RequiredUserContextProps } from "../../context/UserContext";
import { Button, Modal, TextInput } from "carbon-components-react";
import { Organization } from "@pld/shared";
import { OrganizationApiController } from "../../controller/OrganizationApiController";
import { toast } from "react-toastify";

import {Stack} from '@carbon/react';

type ModalProps = {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export type DeleteOrgProps = {
  org: Organization;
} & ModalProps & RequiredUserContextProps;

export type DeleteOrgState = {
  orgName: string;
}

export class DeleteOrgModal extends React.Component<DeleteOrgProps, DeleteOrgState> {

  constructor(props: DeleteOrgProps) {
    super(props);
    this.state = {
      orgName: '',
    }
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  private onClickDelete() {
    OrganizationApiController.deleteOrg(this.props.userContext.accessToken, this.props.org._id, (org, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      } else {
        toast('Votre organisation a été supprimer !', {type: 'success'});
        this.props.onSuccess();
      }
    });
  }

  override render() {
    return (
      <Modal
        open={this.props.open}
        onRequestClose={this.props.onClose}
        passiveModal>
        <h3>Supprimer votre organisation '{this.props.org.name}' ?</h3>
        <br/>
        <p>Tout les utilisateurs encore présents dans l'organisation ne pourront plus récupérer des éléments une fois l'organisation supprimer, elle n'apparaitra plus dans leurs organisations active.</p>
        <p>Les éléments suivants seront supprimer : <br/> <span>Plds, Dods, Calendriers, Workspace, Document et toute information liée a cette Organisation .</span></p>
        <br/>
        <p style={{fontWeight: 'bold'}}>Attention, cette opération est irreversible.</p>
        <br/>
        <p>pour continuer, veuillez rentrer le nom de votre organisation</p>
        <Stack gap={3}>
          <TextInput id={"orgName"} labelText={"Nom de votre organisation"} onChange={(e) => this.setState({orgName: e.currentTarget.value})}/>
          <Button disabled={this.state.orgName !== this.props.org.name} onClick={this.onClickDelete} kind={"danger"}>Supprimer</Button>
        </Stack>
      </Modal>
    )
  }

}
