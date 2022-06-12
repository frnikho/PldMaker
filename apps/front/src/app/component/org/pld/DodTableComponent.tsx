import React from "react";
import {RequiredUserContextProps} from "../../../context/UserContext";
import {
  Button,
  DataTableSkeleton, Select, SelectItem,
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

import {DataTable} from '@carbon/react'

import {NewDodModal} from "../../../modal/dod/NewDodModal";
import {Dod, DodStatus} from "../../../../../../../libs/data-access/pld/dod/Dod";
import {Pld} from "../../../../../../../libs/data-access/pld/Pld";
import {Organization} from "../../../../../../../libs/data-access/organization/Organization";
import {DodApiController} from "../../../controller/DodApiController";
import {PldGenerator} from "../../../docx/PldGenerator";

import {TrashCan, Download, Filter, Edit} from '@carbon/icons-react'
import {User} from "../../../../../../../libs/data-access/user/User";
import {toast} from "react-toastify";

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
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("fr");
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
      console.log(dod, error);
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

  private onDismissDodModal() {
    this.setState({
      openCreateModal: false,
      editionDod: undefined,
    });
  }

  private onCreateDod(newDod: Dod) {
    this.setState({
      openCreateModal: false,
      editionDod: undefined,
    });
    this.props.onCreatedDod();
  }

  private showSelectStatus(dodId: string): JSX.Element {
    return (
      <Select
        inline
        id="dod select"
        labelText=""
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
        <SelectItem text={"A faire"} value={"A faire"}/>
        <SelectItem text={"En cours"} value={"En cours"}/>
        <SelectItem text={"A tester"} value={"A tester"}/>
        <SelectItem text={"Fini"} value={"Fini"}/>
        <SelectItem text={"Non fini"} value={"Non fini"}/>
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
        created_date: formatDate(new Date(dod.created_date))
      }));
    return (
      <DataTable rows={rowData} headers={headerData} isSortable>
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
            <TableToolbar>
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
                    const dod: Dod[] = this.props.dod.map((dod) => {
                      return {
                        ...dod,
                        estimatedWorkTime: dod.estimatedWorkTime.map((workTime) => {
                          return {
                            ...workTime,
                            users: workTime.users.map((userId) => {
                              const u1 = (this.props.org.members as User[]).find((user) => user._id === userId);
                              if (u1 !== undefined) {
                                return u1.email;
                              }
                              if (userId === (this.props.org.owner as User)._id)
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
                    });

                  }}
                >
                  Générer un docx
                </TableBatchAction>
              </TableBatchActions>
              <TableToolbarContent>
                <TableToolbarSearch
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                  onChange={onInputChange}
                />
                <TableToolbarMenu
                  renderIcon={Filter}
                  iconDescription={"Filter"}
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                >
                  <TableToolbarAction primaryFocus onClick={() => alert('Alert 1')}>
                    Action 1
                  </TableToolbarAction>
                  <TableToolbarAction onClick={() => alert('Alert 2')}>
                    Action 2
                  </TableToolbarAction>
                  <TableToolbarAction onClick={() => alert('Alert 3')}>
                    Action 3
                  </TableToolbarAction>
                </TableToolbarMenu>
                <Button
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                  onClick={this.onClickCreateDod}
                  size="sm"
                  kind="primary"
                >
                  Créer un dod
                </Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableSelectAll {...getSelectionProps()} />
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
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
                    <TableCell key={"actions"}>
                      <Button kind={"ghost"} iconDescription={"Voir"} renderIcon={Edit} onClick={() => {
                        this.onClickUpdateDod(this.props.dod.find((dod) => dod._id === row.id));
                      }}>Modifier/Editer</Button>
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
        {this.showDatatable()}
      </>
    );
  }

}
