import * as React from "react";
import { DodTableComponent } from "../../dod/DodTableComponent";
import { Dod, DodStatus, Organization, OrganizationSection, Pld } from "@pld/shared";
import { Tile } from "carbon-components-react";
import { TileStyle } from "@pld/ui";
import { toast } from "react-toastify";

type Props = {
  dodStatus: DodStatus[];
  dod: Dod[];
  pld: Pld;
  org: Organization;
  sections: OrganizationSection[];
  reloadDoDs: () => void;
};
export const PldDoDsComponents = (props: Props) => {

  const onDodCreated = () => {
    toast('DoD crée avec succès', {type: 'success'});
    props.reloadDoDs();
  }

  const onDodUpdated = () => {
    toast('DoD mise à jour avec succès', {type: 'success'});
    props.reloadDoDs();
  }

  const onDodDeleted = () => {
    toast('DoD supprimée avec succès', {type: 'success'});
    props.reloadDoDs();
  }

  return (
    <Tile style={TileStyle.default}>
      <h2 style={{fontWeight: 500}}>DoDs</h2>
      <DodTableComponent sections={props.sections} dodStatus={props.dodStatus} onCreatedDod={onDodCreated} onDeleteDod={onDodDeleted} onUpdateDod={onDodUpdated} pld={props.pld} org={props.org} dods={props.dod}/>
    </Tile>
  );
};
