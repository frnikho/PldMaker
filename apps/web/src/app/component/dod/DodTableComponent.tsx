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
import { Dod, DodStatus, Organization, OrganizationSection, Pld, SetDodStatus } from "@pld/shared";
import { DodApiController } from "../../controller/DodApiController";

import { Add, Edit, ImportExport, TrashCan } from "@carbon/icons-react";
import { toast } from "react-toastify";
import { PreviewDodModal } from "../../modal/dod/PreviewDodModal";
import { formatShortDate } from "@pld/utils";
import { ButtonStyle } from "../../style/ButtonStyle";
import { useLanguage } from "../../hook/useLanguage";

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
}

export const DodTableComponent = (props: Props) => {

  const userCtx = useContext<UserContextProps>(UserContext);
  const {getCurrentLanguage} = useLanguage();
  const [selectedDod, setSelectedDod] = useState<undefined | Dod>(undefined);
  const [modals, setModals] = useState<Modals>({openEdition: false, openPreview: false});
  const [type, setType] = useState<DodType>(DodType.New);

  const updateModal = (key: keyof Modals, value: boolean) => {
    setModals({
      ...modals,
      [key]: value,
    })
  }

  const getTableHeader = () => {
    return [
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
    ]
  }

  const onDodCreated = (createdDod: Dod) => {
    updateModal('openEdition', false);
    setSelectedDod(undefined);
    props.onCreatedDod();
  }

  const onClickDeleteDod = (dodId: string) => {
    DodApiController.deleteDod(userCtx.accessToken, props.org._id, props.pld._id, dodId, (dod, error) => {
      if (error) {
        props.onDeleteDod();
      }
    });
  }

  const onClickUpdateDod = (dod?: Dod) => {
    if (dod === undefined) {
      toast('Impossible de modifier la dod !', {type: 'error'})
    } else {
      updateModal('openEdition', true);
      setType(DodType.Edit);
      setSelectedDod(dod);
    }
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

  const showDatatable = () => {
    const rowData = props.dods.sort((a, b) => new Date(b.created_date).getDate() - new Date(a.created_date).getDate()).map((dod) =>
      ({
        ...dod,
        id: dod._id,
        created_date: formatShortDate(new Date(dod.created_date))
      }));
    return (
      <DataTable rows={rowData} headers={getTableHeader()} isSortable locale={getCurrentLanguage()}>
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
              <TableBatchActions {...getBatchActionProps()}>
                <TableBatchAction
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                  renderIcon={TrashCan}
                  onClick={() => {
                    const dod: Dod[] = selectedRows.map((row) => {
                      return props.dods.find((a) => row.id === a._id);
                    })
                    dod.forEach((dod) => {
                      onClickDeleteDod(dod._id);
                      props.onDeleteDod();
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
                    const file = new Blob([JSON.stringify(props.dods)], {type: "text/plain"});
                    a.href = URL.createObjectURL(file);
                    a.download = 'data.bak';
                    a.click();
                  }}>
                    Exporter
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
                      return (<TableCell key={cell.id} style={{cursor: 'pointer'}} onClick={() => onClickPreviewDod(props.dods.find((dod) => dod._id === row.id))}>{cell.value}</TableCell>)
                    })}
                    <TableCell>
                      {showSelectStatus(row.id)}
                    </TableCell>
                    <TableCell key={"actions"} style={{minWidth: '100px'}}>
                      <Link renderIcon={Edit} onClick={() => onClickUpdateDod(props.dods.find((dod) => dod._id === row.id))}/>
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
      <NewDodModal dod={selectedDod} sections={props.sections} type={type} onSuccess={(d) => onDodCreated(d as Dod)} open={modals.openEdition} onDismiss={() => updateModal('openEdition', false)} pld={props.pld} org={props.org}/>
      {selectedDod !== undefined ? <PreviewDodModal dod={selectedDod} open={modals.openPreview} onDismiss={() => updateModal('openPreview', false)} onSuccess={() => updateModal('openPreview', false)}/> : null}
      {showDatatable()}
    </>
  );
};
