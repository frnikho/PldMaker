import React from "react";
import {RequiredUserContextProps} from "../../context/UserContext";
import {
  Button, Link,
  Select, SelectItem,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar, TableToolbarAction,
  TableToolbarContent, TableToolbarMenu,
  TableToolbarSearch,
} from "carbon-components-react";

import {DataTable} from '@carbon/react';

import {NewDodModal} from "../../modal/dod/NewDodModal";
import {Dod, Pld, Organization, User} from "@pld/shared";
import {DodApiController} from "../../controller/DodApiController";
import {PldGenerator} from "../../docx/PldGenerator";

import {TrashCan, Download, Edit, ImportExport, View, Add} from '@carbon/icons-react'
import {toast} from "react-toastify";
import {PreviewDodModal} from "../../modal/dod/PreviewDodModal";
import {formatShortDate} from '@pld/utils';

export type DodTableComponentProps = {
  onUpdateDod: () => void;
  onCreatedDod: () => void;
  onDeleteDod: () => void;
  pld: Pld;
  org: Organization;
  dod: Dod[];
} & RequiredUserContextProps

export type DodTableComponentState = {
  openCreateModal: boolean;
  editionDod?: Dod;
  openPreviewModal: boolean;
}

export const headerData = [
  {
    key: 'version',
    header: 'Version',
  },
  {
    key: 'title',
    header: 'Nom',
  },
  {
    key: 'description',
    header: 'Description',
  },
  {
    key: 'created_date',
    header: 'Date de création'
  },
];


export class DodTableComponent extends React.Component<DodTableComponentProps, DodTableComponentState> {

  constructor(props) {
    super(props);
    this.state = {
      openCreateModal: false,
      openPreviewModal: false,
      editionDod: undefined,
    }
    this.onClickCreateDod = this.onClickCreateDod.bind(this);
    this.onDismissDodModal = this.onDismissDodModal.bind(this);
    this.onCreateDod = this.onCreateDod.bind(this);
    this.onClickDeleteDod = this.onClickDeleteDod.bind(this);
    this.onClickUpdateDod = this.onClickUpdateDod.bind(this);
  }

  private onClickCreateDod() {
    this.setState({
      openCreateModal: true,
    });
  }

  private onClickDeleteDod(dodId: string) {
    DodApiController.deleteDod(this.props.userContext.accessToken, dodId, (dod, error) => {
      if (error) {
        this.props.onDeleteDod();
      }
    });
  }

  private onClickUpdateDod(dod?: Dod) {
    if (dod === undefined) {
      toast('Impossible de modifier la dod !', {type: 'error'})
    } else {
      this.setState({
        openCreateModal: true,
        editionDod: dod,
      });
    }
  }

  private onClickPreviewDod(dod?: Dod) {
    if (dod === undefined) {
      toast('Impossible de preview la DoD !', {type: 'error'})
      return;
    }
    this.setState({
      openPreviewModal: true,
      editionDod: dod
    });
  }

  private onDismissDodModal() {
    this.setState({
      openCreateModal: false,
      openPreviewModal: false,
      editionDod: undefined,
    });
  }

  private onCreateDod(newDod: Dod) {
    console.log(newDod.title);
    this.setState({
      openCreateModal: false,
      editionDod: undefined,
    });
    this.props.onCreatedDod();
  }

  private showSelectStatus(dodId: string): JSX.Element | null {
    const currentDod = this.props.dod.find((dod) => dod._id === dodId);
    if (currentDod === undefined)
      return null;
    const dodColor = this.props.org.dodColors.find((d) => d.name === currentDod.status);
    return (
      <Select
        inline
        id="dod select"
        labelText={<div className="square" style={{
          height: '20px',
          width: '20px',
          backgroundColor: `#${dodColor?.color}`,
          borderRadius: '50%',
          display: 'inline-block',
        }}/>}
        onChange={(e) => {

          DodApiController.updateDodStatus(this.props.userContext.accessToken, {
            dodId: dodId,
            status: e.currentTarget.value
          }, (dod, error) => {
            if (error) {
              toast(error.error, {type: 'error'});
            }
            if (dod !== null) {
              toast('Status de la DOD mit à jour 👍 !');
            }
          });
        }}
        helperText="">
        <SelectItem
          hidden
          value={""}
          text={this.showStatusSelect(dodId)}/>

        {this.props.org.dodColors.map((status, index) => {
          return (<SelectItem key={index} text={status.name} value={status.name}/>);
        })}
      </Select>
    );
  }

  private showStatusSelect(dodId: string): string {
    const dod: Dod | undefined = this.props.dod.find((a) => a._id === dodId)
    if (dod === undefined)
      return '';
    return dod.status;
  }

  private showDatatable() {
    const rowData = this.props.dod.sort((a, b) => new Date(b.created_date).getDate() - new Date(a.created_date).getDate()).map((dod) =>
      ({
        ...dod,
        id: dod._id,
        created_date: formatShortDate(new Date(dod.created_date))
      }));
    return (
      <DataTable rows={rowData} headers={headerData} isSortable locale={"fr"}>
        {({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getSelectionProps,
            getBatchActionProps,
            onInputChange,
            selectedRows,
          }) => (
          <TableContainer>
            <TableToolbar size={"lg"}>
              <TableBatchActions {...getBatchActionProps()}>
                <TableBatchAction
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                  renderIcon={TrashCan}
                  onClick={() => {
                    const dod: Dod[] = selectedRows.map((row) => {
                      return this.props.dod.find((a) => row.id === a._id);
                    })
                    dod.forEach((dod) => {
                      this.onClickDeleteDod(dod._id);
                      this.props.onDeleteDod();
                    })
                  }}
                >
                  Supprimer
                </TableBatchAction>
                <TableBatchAction
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                  renderIcon={Download}
                  onClick={() => {
                    /*const dod: Dod[] = this.props.dod.map((dod) => {
                      return {
                        ...dod,
                        estimatedWorkTime: dod.estimatedWorkTime.map((workTime) => {
                          return {
                            ...workTime,
                            users: workTime.users.map((wtUser) => {
                              console.log(wtUser);
                              const u1 = (this.props.org.members as User[]).find((user) => user._id === wtUser._id);
                              if (u1 !== undefined) {
                                return u1.email;
                              }
                              if (wtUser._id === (this.props.org.owner as User)._id)
                                return (this.props.org.owner as User).email;
                              return undefined;
                            }).filter((a) => a !== undefined) as string[],
                          }
                        })
                      }
                    })
                    const pld: PldGenerator = new PldGenerator(this.props.pld, selectedRows.map((row) => {
                      return dod.find((a) => row.id === a._id);
                    }), this.props.org);


                    PldGenerator.getBlobFromDoc(pld.generate(), (blob) => {
                      window.open(URL.createObjectURL(blob));
                    });*/

                  }}
                >
                  Générer un docx
                </TableBatchAction>
              </TableBatchActions>
              <TableToolbarContent>
                <TableToolbarSearch
                  placeholder={"1.0.5, CI/CD ..."}
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                  onChange={onInputChange}
                />
                <TableToolbarMenu
                  renderIcon={ImportExport}
                  iconDescription={"Filter"}
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                >
                  <TableToolbarAction onClick={() => {
                    //TODO import data

                  }}>
                    Importer
                  </TableToolbarAction>
                  <TableToolbarAction onClick={() => {
                    const a = document.createElement("a");
                    const file = new Blob([JSON.stringify(this.props.dod)], {type: "text/plain"});
                    a.href = URL.createObjectURL(file);
                    a.download = 'data.bak';
                    a.click();
                  }}>
                    Exporter
                  </TableToolbarAction>
                </TableToolbarMenu>
                <Button
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                  onClick={this.onClickCreateDod}
                  renderIcon={Add}
                  iconDescription={"Add"}
                  size="sm"
                  kind="primary"
                >Créer une DoD</Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableSelectAll {...getSelectionProps()} />
                  {headers.map((header) => (
                    <TableHeader style={{whiteSpace: 'nowrap'}} {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                  <TableHeader>Status</TableHeader>
                  <TableHeader></TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow {...getRowProps({ row })}>
                    <TableSelectRow {...getSelectionProps({ row })} />
                    {row.cells.map((cell) => {
                      return (<TableCell key={cell.id}>{cell.value}</TableCell>)
                    })}
                    <TableCell>
                      {this.showSelectStatus(row.id)}
                    </TableCell>
                    <TableCell key={"actions"} style={{minWidth: '100px'}}>
                      <Link renderIcon={Edit} onClick={() => this.onClickUpdateDod(this.props.dod.find((dod) => dod._id === row.id))}/>
                      <Link renderIcon={View} onClick={() => this.onClickPreviewDod(this.props.dod.find((dod) => dod._id === row.id))}/>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>

    );
  }

  override render() {
    return (
      <>
        <NewDodModal editionDod={this.state.editionDod} authContext={this.props.userContext} open={this.state.openCreateModal} onDismiss={this.onDismissDodModal} onCreatedDod={this.onCreateDod} lastDod={[]} pld={this.props.pld} org={this.props.org}/>
        {this.state.editionDod !== undefined ? <PreviewDodModal dod={this.state.editionDod} open={this.state.openPreviewModal} onDismiss={this.onDismissDodModal} onSuccess={() => null}/> : null}
        {this.showDatatable()}
      </>
    );
  }

}
