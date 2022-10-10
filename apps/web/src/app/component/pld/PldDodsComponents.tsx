import * as React from "react";
import { DodTableComponent } from "../dod/DodTableComponent";
import { Dod, DodStatus, Organization, Pld } from "@pld/shared";
import { UserContext, UserContextProps } from "../../context/UserContext";
import { useContext } from "react";
import { Tile } from "carbon-components-react";

type Props = {
  dodStatus: DodStatus[];
  dod: Dod[];
  pld: Pld;
  org: Organization;
};
export const PldDodsComponents = (props: Props) => {

  const userCtx = useContext<UserContextProps>(UserContext);

  const onDodCreated = () => {

  }

  const onDodUpdated = () => {

  }

  const onDodDeleted = () => {

  }

  return (
    <Tile style={style.tile}>
      <h2 style={{fontWeight: 500}}>DoDs</h2>
      <DodTableComponent dodStatus={props.dodStatus} userContext={userCtx} onCreatedDod={onDodCreated} onDeleteDod={onDodDeleted} onUpdateDod={onDodUpdated} pld={props.pld} org={props.org} dod={props.dod}/>
    </Tile>
  );
};

const style = {
  tile: {

  },
  button: {

  }
}
