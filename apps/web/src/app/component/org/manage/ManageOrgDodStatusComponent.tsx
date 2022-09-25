import React  from "react";
import { DodStatus, Organization } from "@pld/shared";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableToolbar, TableToolbarContent, Tile } from "carbon-components-react";

import {DataTable} from '@carbon/react';

import {Add, Star} from '@carbon/icons-react';
import { RequiredUserContextProps } from "../../../context/UserContext";
import { formatLongDate } from "@pld/utils";
import { CreateDodStatusModal } from "../../../modal/org/manage/CreateDodStatusModal";
import { UpdateDodStatusModal } from "../../../modal/org/manage/UpdateDodStatusModal";

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

export class ManageOrgDodStatusComponent extends React.Component<ManageOrgDodStatusProps, ManageOrgDodStatusState> {

  constructor(props: ManageOrgDodStatusProps) {
    super(props);
    this.state = {
      openCreate: false,
      openUpdate: false,
    }
  }

  private showDodStatusBodyCell(cell, index) {
    const dodStatus = this.props.dodStatus.find((status) => status._id === cell.id);
    if (dodStatus === undefined)
      return;
    return (
      <TableRow style={{cursor: 'pointer'}} key={index} onClick={() => this.setState({openUpdate: true, selectedDodStatus: dodStatus})}>
        <TableCell title={dodStatus.useDefault ? 'Utilisé par défaut' : undefined}>
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
            {dodStatus.useDefault ? <Star style={{marginLeft: 10}} title={'Par défaut'}/> : null}
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

  override render() {
    return (
      <>
        <CreateDodStatusModal userContext={this.props.userContext} org={this.props.org} open={this.state.openCreate} onDismiss={() => this.setState({openCreate: false})} onSuccess={() => {
          this.setState({openCreate: false, openUpdate: false})
          this.props.onStatusChanged(DodStatusOperationType.Created);
        }}/>
        {this.state.selectedDodStatus ? <UpdateDodStatusModal org={this.props.org} selectedDodStatus={this.state.selectedDodStatus} userContext={this.props.userContext} open={this.state.openUpdate} onDismiss={() => this.setState({openUpdate: false})} onSuccess={(status) => {
          this.setState({openUpdate: false, openCreate: false});
          this.props.onStatusChanged(status as DodStatusOperationType);
        }}/> : null}
        <Tile>
          <div>
            <p>Le statut des DoDs vous permet de vous retrouver dans l'avancement de celle-ci.</p>
            <p>La couleur choisit est également utiliser lors de la génération du document word.</p>
            <p style={{fontStyle: 'italic'}}>Il ne faut pas supprimer les status actif de vos DoDs avant de les avoirs changers.</p>
          </div>
          <DataTable rows={this.props.dodStatus.map((dodStatus) => ({...dodStatus, id: dodStatus._id})).sort((a, b) => {
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
                      onClick={() => {this.setState({openCreate: true})}}
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
                    {rows.map((row, index) => this.showDodStatusBodyCell(rows[index], index))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
        </Tile>
      </>
    )
  }

}
