import * as React from "react";
import { Accordion, Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "carbon-components-react";
import { formatLongDate } from "@pld/utils";

import { Stack } from '@carbon/react';

import {DocumentAdd} from '@carbon/icons-react';

import { Organization, Pld, PldRevision } from "@pld/shared";
import { toast } from "react-toastify";
import { AddRevisionPldModal } from "../../../modal/pld/AddRevisionPldModal";
import { useState } from "react";
import { EditRevisionPldModal } from "../../../modal/pld/EditRevisionPldModal";
import { ButtonStyle } from "@pld/ui";

type Props = {
  pld: Pld;
  org: Organization;
  loadPld: () => void;
};

type Modals = {
  openCreateRevision: boolean;
  openUpdateRevision: boolean;
}

export const PldRevisionsComponent = (props: Props) => {

  const [modals, setModals] = useState<Modals>({openCreateRevision: false, openUpdateRevision: false});
  const [selectedRevision, setSelectedRevision] = useState<PldRevision | undefined>(undefined);

  const updateModals = (key: keyof Modals, value: boolean) => {
    setModals({
      ...modals,
      [key]: value,
    });
  }

  const onRevisionCreated = () => {
    updateModals('openCreateRevision', false);
    toast('Révision ajoutée ', {type: 'success', icon: '👍'})
    props.loadPld();
  }

  const onRevisionUpdated = () => {
    updateModals('openUpdateRevision', false);
  }

  const onClickRevision = (revision: PldRevision) => {
    updateModals('openUpdateRevision', true);
    setSelectedRevision(revision);
  }

  const showAddRevisionButton = () => {
    return (
      <Button style={ButtonStyle.default} renderIcon={DocumentAdd} onClick={() => updateModals('openCreateRevision', true)}>
        Créer une révision
      </Button>
    );
  }

  const showNoRevisions = () => {
    return (<h4 style={{margin: '10px'}}>Aucune révisions disponible.</h4>)
  }

  const showRevisions = () => {
    return (
      <Accordion>
        <Stack gap={5}>
          <h4>Tableau des révisions</h4>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader id={"date"} key={"date"}>Date</TableHeader>
                <TableHeader id={"version"} key={"version"}>Version</TableHeader>
                <TableHeader id={"auteur"} key={"auteur"}>Auteur</TableHeader>
                <TableHeader id={"sections"} key={"sections"}>Section(s)</TableHeader>
                <TableHeader id={"comments"} key={"comments"}>Commentaires</TableHeader>
                <TableHeader id={"statusPld"} key={"statusPld"}>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.pld.revisions.map((revision, index) => {
                return (
                  <TableRow key={index} style={{cursor: 'pointer'}} onClick={() => onClickRevision(revision)}>
                    <TableCell key={index + ':date'}>{formatLongDate(new Date(revision.created_date))}</TableCell>
                    <TableCell key={index + ':revision'}>{revision.version}</TableCell>
                    <TableCell key={index + ':auteur'}>{props.org.name}</TableCell>
                    <TableCell key={index + ':sections'}>{revision.sections.join(', ')}</TableCell>
                    <TableCell key={index + ':comments'}>{revision.comments ?? 'Non-défini'}</TableCell>
                    <TableCell key={index + ':statusPld'}>{revision.currentStep}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Stack>
      </Accordion>
    )
  }

  return (
    <>
      {selectedRevision ? <EditRevisionPldModal
        pld={props.pld}
        open={modals.openUpdateRevision}
        revision={selectedRevision}
        org={props.org}
        onSuccess={onRevisionUpdated}
        onDismiss={() => updateModals('openUpdateRevision', false)}/> : null}
      <AddRevisionPldModal
        org={props.org}
        pld={props.pld}
        open={modals.openCreateRevision}
        onDismiss={() => updateModals('openCreateRevision', false)}
        onSuccess={onRevisionCreated}/>
      {props.pld.revisions.length > 0 ? showRevisions() : showNoRevisions()}
      {showAddRevisionButton()}
    </>
  )
};
