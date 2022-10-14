import * as React from "react";
import { Button, Tile } from "carbon-components-react";

import {Stack} from '@carbon/react';
import { Organization } from "@pld/shared";
import { useContext, useState } from "react";
import { UserContext, UserContextProps } from "../../../context/UserContext";

import {Migrate} from '@carbon/icons-react';
import { MigrateOrgModal } from "../../../modal/org/manage/MigrateOrgModal";

type Props = {
  org: Organization;
};
export const TransferOrgComponent = (props: Props) => {

  const userCtx = useContext<UserContextProps>(UserContext);
  const [modal, setModal] = useState<boolean>(false);

  const isOwner = (): boolean => {
    return props.org?.owner ._id === userCtx.user?._id;
  }

  return (
    <>
      <MigrateOrgModal org={props.org} open={modal} onSuccess={() => setModal(false)} onDismiss={() => setModal(false)}/>
      <Tile style={{padding: '18px'}}>
        <Stack gap={6}>
          <div>
            <p>Vous pouvez transférer vos droits à l'un des utilisateurs de cette organisation.</p>
            <p>Attention, cette opération ne peut être annulée une fois lancer</p>
            <br/>
            <p style={{fontWeight: 'bold'}}>Attention, cette opération est irréversible.</p>
          </div>
          <Button disabled={!isOwner()} onClick={() => setModal(true)} kind={'danger'} renderIcon={Migrate} iconDescription={"migrate"}>
            Transférer
          </Button>
        </Stack>
      </Tile>
    </>
  )
};
