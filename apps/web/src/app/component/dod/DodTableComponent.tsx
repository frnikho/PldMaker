import React, { useContext, useState } from "react";
import { UserContext, UserContextProps } from "../../context/UserContext";
import {
  Button,
  Link,
  Select,
  SelectItem,
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
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarMenu,
  TableToolbarSearch
} from "carbon-components-react";

import { DataTable } from "@carbon/react";

import { DodType, NewDodModal } from "../../modal/dod/NewDodModal";
import { Dod, DodStatus, Organization, OrganizationSection, Pld, SetDodStatus, User } from "@pld/shared";
import { DodApiController } from "../../controller/DodApiController";

import { Add, Edit, ImportExport, TrashCan, Filter, Checkmark } from "@carbon/icons-react";
import { toast } from "react-toastify";
import { PreviewDodModal } from "../../modal/dod/PreviewDodModal";
import { formatShortDate } from "@pld/utils";
import { ButtonStyle } from "@pld/ui";
import { FilterUserDodModal } from "../../modal/pld/FilterUserDodModal";

type Props = {
  org: Organization;
  pld: Pld;
  dods: Dod[];
  dodStatus: DodStatus[];
  sections: OrganizationSection[];
  onUpdateDod: () => void;
  onCreatedDod: () => void;
  onDeleteDod: () => void;
};

type Modals = {
  openEdition: boolean;
  openPreview: boolean;
  openUserFilterDod: boolean;
}

enum Sorting {
  MyAssignedDoDs,
  MyCreatedDoDs,
  UserDoDs,
}

export const DodTableComponent = (props: Props) => {

  const userCtx = useContext<UserContextProps>(UserContext);
  const [selectedDod, setSelectedDod] = useState<undefined | Dod>(undefined);
  const [modals, setModals] = useState<Modals>({openEdition: false, openPreview: false, openUserFilterDod: false});
  const [type, setType] = useState<DodType>(DodType.New);
  const [filter, setFilter] = useState<undefined | Sorting>(undefined);
  const [filteredUser, setFilteredUser] = useState<User[]>([]);

  const updateModal = (key: keyof Modals, value: boolean) => {
    setModals({
      ...modals,
      [key]: value,
    })
  }

  const getTableHeader = () => {
    return [
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
    ]
  }

  const onDodCreated = () => {
    updateModal('openEdition', false);
    setSelectedDod(undefined);
    props.onCreatedDod();
  }

  const onClickDeleteDod = (dodId: string) => {
    DodApiController.deleteDod(userCtx.accessToken, props.org._id, props.pld._id, dodId, (dod, error) => {
      if (!error) {
        props.onDeleteDod();
      }
    });
  }

  const onClickUpdateDod = (dod?: Dod) => {
    if (dod === undefined) {
      toast('Impossible de modifier la dod !', {type: 'error'});
    } else {
      updateModal('openEdition', true);
      setType(DodType.Edit);
      setSelectedDod(dod);
    }
  }

  const onClickEdit = (dod: Dod) => {
    setSelectedDod(dod);
    setModals({openEdition: true, openPreview: false, openUserFilterDod: false});
  }

  const onClickPreviewDod = (dod?: Dod) => {
    if (dod === undefined) {
      toast('Impossible de preview la DoD !', {type: 'error'})
      return;
    }
    updateModal('openPreview', true);
    setType(DodType.Preview);
    setSelectedDod(dod);
  }

  const showSelectStatus = (dodId: string) => {
    const currentDod = props.dods.find((dod) => dod._id === dodId);
    if (currentDod === undefined)
      return null;
    const dodColor = props.dodStatus.find((status) => status._id === currentDod.status._id);
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
          const newFoundStatus = props.dodStatus.find((a) => a._id === e.currentTarget.value);
          if (newFoundStatus === undefined) {
            toast('Impossible de changer le status !', {type: 'error'});
            return;
          }
          const newStatus: SetDodStatus = {statusId: newFoundStatus._id};
          DodApiController.updateDodStatus(userCtx.accessToken, props.org._id, props.pld._id, dodId, newStatus,(dod, error) => {
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
          text={showStatusSelect(dodId)}/>

        {props.dodStatus.map((status, index) => {
          return (<SelectItem key={index} text={status.name} value={status._id}/>);
        })}
      </Select>
    );
  }

  const showStatusSelect = (dodId: string): string => {
    const dod: Dod | undefined = props.dods.find((a) => a._id === dodId)
    if (dod === undefined)
      return '';
    return dod.status.name;
  }

  const compare = (a: string, b: string): number => {
    const a1 = a.split('.');
    const b1 = b.split('.');
    const len = Math.min(a1.length, b1.length);
    for (let i = 0; i < len; i++) {
      const a2 = +a1[i] || 0;
      const b2 = +b1[i] || 0;
      if (a2 !== b2) {
        return a2 > b2 ? 1 : -1;
      }
    }
    return a1.length - b1.length;
  }

  const onClickFilterByUser = () => {
    updateModal('openUserFilterDod', true);
  }

  const onSelectedUserToFilterDoDs = (user: User[]) => {
    updateModal('openUserFilterDod', false);
    setFilteredUser(user);
    setFilter(Sorting.UserDoDs);
    console.log(user);
  }

  const showDoDs = () => {
    let DoDs: Dod[] = props.dods;
    if (filter === Sorting.MyAssignedDoDs) {
      DoDs = DoDs.filter((d) => d.estimatedWorkTime.find((wt) => wt.users.find((u) => u._id === userCtx.user?._id)));
    } else if (filter === Sorting.MyCreatedDoDs) {
      DoDs = DoDs.filter((d) => d.owner._id === userCtx.user?._id);
    } else if (filter === Sorting.UserDoDs) {
      DoDs = DoDs.filter((d) => d.estimatedWorkTime.some((d) => d.users.some((u) => filteredUser.some((fu) => fu._id === u._id))));
    }
    return DoDs.sort((a, b) => compare(a.version, b.version)).map((dod) => {
      return {
        ...dod,
        id: dod._id,
        created_date: formatShortDate(new Date(dod.created_date))
      }
    });
  }

  const showDatatable = () => {
    return (
      <DataTable rows={showDoDs()} headers={getTableHeader()} isSortable locale={'fr'}>
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
            <TableToolbar size={"lg"} style={{marginBottom: 10}}>
              <TableBatchActions {...getBatchActionProps()} translateWithId={(messageId, args) => {
                if (messageId === 'carbon.table.batch.cancel') {
                  return `Annuler`;
                } else if (messageId === 'carbon.table.batch.items.selected') {
                  return `${args?.totalSelected} DoDs sélectionnées`
                } else {
                  return '';
                }
              }}>
                <TableBatchAction
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                  renderIcon={TrashCan}
                  onClick={() => {
                    const dod: Dod[] = selectedRows.map((row) => {
                      return props.dods.find((a) => row.id === a._id);
                    })
                    dod.forEach((dod) => {
                      onClickDeleteDod(dod._id);
                    })
                  }}
                >
                  Supprimer
                </TableBatchAction>
              </TableBatchActions>
              <TableToolbarContent>
                <TableToolbarSearch
                  placeholder={"1.0.5, CI/CD ..."}
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                  onChange={onInputChange}
                />
                <TableToolbarMenu
                  disabled
                  renderIcon={ImportExport}
                  iconDescription={"WIP"}
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                >
                  <TableToolbarAction onClick={() => {
                    //TODO import data

                  }}>
                    Importer
                  </TableToolbarAction>
                  <TableToolbarAction onClick={() => {
                    const a = document.createElement("a");
                    const file = new Blob([JSON.stringify(props.dods)], {type: "text/plain"});
                    a.href = URL.createObjectURL(file);
                    a.download = 'data.bak';
                    a.click();
                  }}>
                    Exporter
                  </TableToolbarAction>
                </TableToolbarMenu>
                <TableToolbarMenu
                  renderIcon={Filter}
                  iconDescription={"Filter"}
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                >
                  <TableToolbarAction onClick={() => setFilter(undefined)}>
                    {filter === undefined ? <Checkmark style={{marginRight: 5}}/> : ''} Toutes les DoDs
                  </TableToolbarAction>
                  <TableToolbarAction onClick={() => setFilter(Sorting.MyAssignedDoDs)}>
                    {filter === Sorting.MyAssignedDoDs ? <Checkmark style={{marginRight: 5}}/> : ''} Mes DoDs assignés
                  </TableToolbarAction>
                  <TableToolbarAction onClick={() => setFilter(Sorting.MyCreatedDoDs)}>
                    {filter === Sorting.MyCreatedDoDs ? <Checkmark style={{marginRight: 5}}/> : ''} Mes DoDs créer
                  </TableToolbarAction>
                  <TableToolbarAction onClick={() => onClickFilterByUser()}>
                    {filter === Sorting.UserDoDs ? <Checkmark style={{marginRight: 5}}/> : ''} Par utilisateurs
                  </TableToolbarAction>
                </TableToolbarMenu>
                <Button
                  style={ButtonStyle.default}
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                  onClick={() => {
                    setType(DodType.New);
                    updateModal("openEdition", true);
                  }}
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
                  <TableHeader>Version</TableHeader>
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
                    <TableCell key={"version"}>
                      {`${props.dods.find((dod) => dod._id === row.id)?.version} ${props.dods.find((dod) => dod._id === row.id)?.sketch ? '📝' : ''}`}
                    </TableCell>
                    {row.cells.map((cell) => {
                      return (<TableCell key={cell.id} style={{cursor: 'pointer'}} onClick={() => onClickPreviewDod(props.dods.find((dod) => dod._id === row.id))}>{cell.value}</TableCell>)
                    })}
                    <TableCell>
                      {showSelectStatus(row.id)}
                    </TableCell>
                    <TableCell key={"actions"} style={{minWidth: '100px'}}>
                      <Link style={{cursor: 'pointer'}} renderIcon={Edit} onClick={() => onClickUpdateDod(props.dods.find((dod) => dod._id === row.id))}/>
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

  return (
    <>
      <NewDodModal dod={selectedDod} sections={props.sections} type={type} onSuccess={() => onDodCreated()} open={modals.openEdition} onDismiss={() => {
        updateModal("openEdition", false);
        setSelectedDod(undefined);
      }} pld={props.pld} org={props.org}/>
      <FilterUserDodModal org={props.org} open={modals.openUserFilterDod} onDismiss={() => updateModal('openUserFilterDod', false)} onSuccess={(user) => onSelectedUserToFilterDoDs(user as User[])}/>
      {selectedDod !== undefined ? <PreviewDodModal onClickEdit={onClickEdit} dod={selectedDod} open={modals.openPreview} onDismiss={() => {
        updateModal("openPreview", false);
        setSelectedDod(undefined);
      }} onSuccess={() => {
        updateModal("openPreview", false);
        setSelectedDod(undefined);
      }}/> : null}
      {showDatatable()}
    </>
  );
};
