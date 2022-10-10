import * as React from "react";
import { Button, Tile } from "carbon-components-react";

import {Stack} from '@carbon/react';

import {Fire} from '@carbon/icons-react';
import { useContext, useState } from "react";
import { UserContext, UserContextProps } from "../../../context/UserContext";
import { Organization } from "@pld/shared";
import { DeleteOrgModal } from "../../../modal/org/manage/DeleteOrgModal";
import { useNavigate } from "react-router-dom";

type Props = {
  org: Organization;
};

export const DeleteOrgComponent = (props: Props) => {

  const userCtx = useContext<UserContextProps>(UserContext);
  const navigate = useNavigate();
  const [modal, setModal] = useState<boolean>(false);

  const isOwner = (): boolean => {
    return props.org?.owner ._id === userCtx.user?._id;
  }

  return (
    <>
      <DeleteOrgModal org={props.org} open={modal} onSuccess={() => {
        setModal(false);
        navigate('/');
      }} onClose={() => setModal(false)} userContext={userCtx}/>
      <Tile style={{padding: '18px'}}>
        <Stack gap={6}>
          <div>
            <p>Tous les utilisateurs encore présents dans l'organisation ne pourront plus récupérer des éléments une fois l'organisation supprimer, elle n'apparaîtra plus dans leurs organisations active.</p>
            <p>Les éléments suivants seront supprimés : <br/> <span>Plds, Dods, Calendriers, Workspace, Document et toute information liée a cette Organisation .</span></p>
            <br/>
            <p style={{fontWeight: 'bold'}}>Attention, cette opération est irréversible.</p>
          </div>
          <Button disabled={!isOwner()} onClick={() => setModal(true)} kind={'danger'} renderIcon={Fire} iconDescription={"delete"}>
            Supprimer
          </Button>
        </Stack>
      </Tile>
    </>);
};
