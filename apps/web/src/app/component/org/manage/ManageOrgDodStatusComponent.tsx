import React, { useCallback, useContext, useState } from "react";
import { DodStatus, Organization } from "@pld/shared";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableToolbar, TableToolbarContent, Tile } from "carbon-components-react";

import {DataTable} from '@carbon/react';

import {Add, Star} from '@carbon/icons-react';
import { RequiredUserContextProps } from "../../../context/UserContext";
import { formatLongDate } from "@pld/utils";
import { CreateDodStatusModal } from "../../../modal/org/manage/CreateDodStatusModal";
import { UpdateDodStatusModal } from "../../../modal/org/manage/UpdateDodStatusModal";
import { LanguageContext, LanguageContextState } from "../../../context/LanguageContext";
import { language } from "../../../language";

export enum DodStatusOperationType {
  Created,
  Updated,
  Deleted,
}

export type ManageOrgDodStatusProps = {
  dodStatus: DodStatus[];
  org: Organization;
  onStatusChanged: (operation: DodStatusOperationType) => void;
} & RequiredUserContextProps;

export type ManageOrgDodStatusState = {
  openCreate: boolean;
  openUpdate: boolean;
  selectedDodStatus?: DodStatus;
}

type Modal = {
  openCreate: boolean;
  openUpdate: boolean;
}

export function ManageOrgDodStatusComponent(props: ManageOrgDodStatusProps) {

  const languageCtx = useContext<LanguageContextState>(LanguageContext);
  const [modals, setModal] = useState<Modal>({openCreate: false, openUpdate: false});
  const [selectedDodStatus, setSelectedDodStatus] = useState<DodStatus | null>(null);

  const onDismissModal = useCallback((modal: keyof Modal) => {
    setModal({...modals, [modal]: false});
  }, [modals]);

  const showDodStatusBodyCell = (cell, index) => {
    const dodStatus = props.dodStatus.find((status) => status._id === cell.id);
    if (dodStatus === undefined)
      return;
    return (
      <TableRow style={{cursor: 'pointer'}} key={index} onClick={() => {
        setModal({openUpdate: true, openCreate: false});
        setSelectedDodStatus(dodStatus);
      }}>
        <TableCell title={dodStatus.useDefault ? languageCtx.translate(language.lexical.useAsDefault) : undefined}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div className="square" style={{
              height: '20px',
              width: '20px',
              marginRight: 10,
              backgroundColor: `#${dodStatus.color}`,
              borderRadius: '50%',
              display: 'inline-block',
            }}/>
            <p> {dodStatus.name} </p>
            {dodStatus.useDefault ? <Star style={{marginLeft: 10}} title={languageCtx.translate(language.lexical.useAsDefault)}/> : null}
          </div>
        </TableCell>
        <TableCell>
          {formatLongDate(new Date(dodStatus.createdDate))}
        </TableCell>
        <TableCell>
          {formatLongDate(new Date(dodStatus.updatedDate))}
        </TableCell>
      </TableRow>
    )
  }

  return (
    <>
      <CreateDodStatusModal userContext={props.userContext} org={props.org} open={modals.openCreate} onDismiss={() => onDismissModal('openCreate')} onSuccess={() => {
        onDismissModal('openCreate');
        props.onStatusChanged(DodStatusOperationType.Created);
      }}/>
      {selectedDodStatus ? <UpdateDodStatusModal org={props.org} selectedDodStatus={selectedDodStatus} userContext={props.userContext} open={modals.openUpdate} onDismiss={() => onDismissModal('openUpdate')} onSuccess={(status) => {
        onDismissModal('openUpdate');
        props.onStatusChanged(status as unknown as DodStatusOperationType);
      }}/> : null}
      <Tile style={style.tile}>
        <div>
          <p>Le statut des DoDs vous permet de vous retrouver dans l'avancement de celle-ci.</p>
          <p>La couleur choisit est également utilisé lors de la génération du document word.</p>
          <p style={{fontStyle: 'italic'}}>Il ne faut pas supprimer les status actifs de vos DoDs avant de les changers.</p>
        </div>
        <DataTable rows={props.dodStatus.map((dodStatus) => ({...dodStatus, id: dodStatus._id})).sort((a, b) => {
          return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
        })} headers={[]} isSortable locale={"fr"}>
          {({
              rows,
              getBatchActionProps,
            }) => (
            <TableContainer>
              <TableToolbar size={"lg"}>
                <TableToolbarContent>
                  <Button
                    tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                    onClick={() => {setModal({openCreate: true, openUpdate: false})}}
                    renderIcon={Add}
                    iconDescription={"Add"}
                    size="sm"
                    kind="primary"
                  >Créer un nouveau status</Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>
                      Status
                    </TableHeader>
                    <TableHeader>
                      Date de création
                    </TableHeader>
                    <TableHeader>
                      Date de mise à jour
                    </TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => showDodStatusBodyCell(rows[index], index))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </Tile>
    </>
  )
}

const style = {
  tile: {
    borderRadius: 8,
  },
  button: {
    borderRadius: 12
  }
}
