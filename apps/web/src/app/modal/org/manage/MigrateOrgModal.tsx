import React, { useContext, useState } from "react";
import { UserContext, UserContextProps } from "../../../context/UserContext";
import { Button, Modal, Select, SelectItem } from "carbon-components-react";
import { MigrateOrganizationBody, Organization } from "@pld/shared";
import { OrganizationApiController } from "../../../controller/OrganizationApiController";
import { toast } from "react-toastify";

import {Migrate} from '@carbon/icons-react';

import {Stack} from '@carbon/react';
import { ModalProps } from "../../../util/Modal";

type Props = {
  org: Organization;
} & ModalProps;

export const MigrateOrgModal = (props: Props) => {

  const [userId, setUserId] = useState<string>('');
  const userCtx = useContext<UserContextProps>(UserContext);

  const onClickMigrate = () => {
    if (userId === '') {
      toast('Un utilisateur doit être défini pour migrer l\'organisation !', {type: 'error'});
      return;
    }
    const body: MigrateOrganizationBody = new MigrateOrganizationBody(userId);
    OrganizationApiController.migrateOrg(userCtx.accessToken, props.org._id, body,(org, error) => {
      if (error) {
        toast(error.message[0], {type: 'error'});
      } else {
        toast('Votre organisation à bien été migrer !', {type: 'success'});
        props.onSuccess();
      }
    });
  }

  return (
    <Modal
      open={props.open}
      onRequestClose={props.onDismiss}
      passiveModal>
      <h3>Migrer votre organisation '{props.org.name}' ?</h3>
      <br/>
      <p>Vous pouvez transférer vos droits a l'un des utilisateurs de cette organisation.</p>
      <p>Attention, cette opération ne peux être annuler une fois lancer</p>
      <br/>
      <p style={{fontWeight: 'bold'}}>Attention, cette opération est irreversible.</p>
      <br/>
      <Stack gap={6}>
        <Select
          id="select-1"
          title={"Il n'y a aucun membre dans votre organisation !"}
          defaultValue="placeholder-item"
          onChange={(a) => setUserId(a.currentTarget.value)}
          labelText="Sélectionnez un utilisateur"
          disabled={props.org.members.length === 0}>
          {props.org.members.map((u, index) => {
            return (
              <SelectItem
                key={index}
                value={u._id}
                text={u.email}
              />
            )
          })}
        </Select>
        <Button title={"Il n'y a aucun membre dans votre organisation !"} renderIcon={Migrate} disabled={props.org.members.length === 0} onClick={onClickMigrate} kind={"danger"}>Migrer</Button>
      </Stack>
    </Modal>
  );
};
