import React, { useContext, useState } from "react";
import { UserContext, UserContextProps } from "../../../context/UserContext";
import { Button, Modal, TextInput } from "carbon-components-react";
import { Organization } from "@pld/shared";
import { OrganizationApiController } from "../../../controller/OrganizationApiController";
import { toast } from "react-toastify";

import {Stack} from '@carbon/react';

type Props = {
  open: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
  org: Organization;
};
export const DeleteOrgModal = (props: Props) => {

  const [orgName, setOrgName] = useState<string>('');
  const userCtx = useContext<UserContextProps>(UserContext);
  const onClickDelete = () => {
    OrganizationApiController.deleteOrg(userCtx.accessToken, props.org._id, (org, error) => {
      if (error) {
        toast(error.message, {type: 'error'});
      } else {
        toast('Votre organisation a été supprimer !', {type: 'success'});
        props.onSuccess();
      }
    });
  }

  return (
    <Modal
      open={props.open}
      onRequestClose={props.onDismiss}
      passiveModal>
      <h3>Supprimer votre organisation '{props.org.name}' ?</h3>
      <br/>
      <p>Tout les utilisateurs encore présents dans l'organisation ne pourront plus récupérer des éléments une fois l'organisation supprimer, elle n'apparaitra plus dans leurs organisations active.</p>
      <p>Les éléments suivants seront supprimer : <br/> <span>Plds, Dods, Calendriers, Workspace, Document et toute information liée a cette Organisation .</span></p>
      <br/>
      <p style={{fontWeight: 'bold'}}>Attention, cette opération est irreversible.</p>
      <br/>
      <p>pour continuer, veuillez rentrer le nom de votre organisation</p>
      <Stack gap={3}>
        <TextInput id={"orgName"} labelText={"Nom de votre organisation"} onChange={(e) => setOrgName(e.currentTarget.value)}/>
        <Button disabled={orgName !== props.org.name} onClick={onClickDelete} kind={"danger"}>Supprimer</Button>
      </Stack>
    </Modal>
  )
};
