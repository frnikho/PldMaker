import React from "react";
import { RequiredUserContextProps } from "../../context/UserContext";
import { Button, Modal, Select, SelectItem } from "carbon-components-react";
import { MigrateOrganizationBody, Organization } from "@pld/shared";
import { OrganizationApiController } from "../../controller/OrganizationApiController";
import { toast } from "react-toastify";

import {Stack} from '@carbon/react';

type ModalProps = {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export type MigrateOrgProps = {
  org: Organization;
} & ModalProps & RequiredUserContextProps;

export type MigrateOrgState = {
  userId?: string;
}

export class MigrateOrgModal extends React.Component<MigrateOrgProps, MigrateOrgState> {

  constructor(props: MigrateOrgProps) {
    super(props);
    this.state = {
      userId: this.props.org?.members[0]?._id ?? undefined,
    }
    this.onClickMigrate = this.onClickMigrate.bind(this);
  }

  private onClickMigrate() {
    if (this.state.userId === undefined) {
      toast('Un utilisateur doit être défini pour migrer l\'organisation !', {type: 'error'});
      return;
    }
    const body: MigrateOrganizationBody = new MigrateOrganizationBody(this.state.userId);
    OrganizationApiController.migrateOrg(this.props.userContext.accessToken, this.props.org._id, body,(org, error) => {
      if (error) {
        toast(error.message[0], {type: 'error'});
      } else {
        toast('Votre organisation à bien été migrer !', {type: 'success'});
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
        <h3>Migrer votre organisation '{this.props.org.name}' ?</h3>
        <br/>
        <p>Vous pouvez transférer vos droits a l'un des utilisateurs de cette organisation.</p>
        <p>Attention, cette opération ne peux être annuler une fois lancer</p>
        <br/>
        <p style={{fontWeight: 'bold'}}>Attention, cette opération est irreversible.</p>
        <br/>
        <Stack gap={3}>
          <Select
            id="select-1"
            defaultValue="placeholder-item"
            labelText="Select an option"
            helperText="Optional helper text">
            {this.props.org.members.map((u, index) => {
              return (
                <SelectItem
                  key={index}
                  value={u._id}
                  text={u.email}
                />
              )
            })}
          </Select>
          <Button onClick={this.onClickMigrate} kind={"danger"}>Migrer</Button>
        </Stack>
      </Modal>
    )
  }

}
