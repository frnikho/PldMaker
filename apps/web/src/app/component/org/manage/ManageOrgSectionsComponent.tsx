import * as React from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableToolbar, TableToolbarContent, Tile } from "carbon-components-react";
import { DataTable } from '@carbon/react';
import { Organization, OrganizationSection } from "@pld/shared";

import { Add } from '@carbon/icons-react';
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { UpdateOrgSectionModal } from "../../../modal/org/UpdateOrgSectionModal";
import { UserContext, UserContextProps } from "../../../context/UserContext";
import { DeleteOrgSectionModal } from "../../../modal/org/DeleteOrgSectionModal";
import { CreateOrgSectionModal } from "../../../modal/org/CreateOrgSectionModal";

export const sectionHeaderData = [
  {
    key: 'section',
    header: 'Section',
  },
  {
    key: 'name',
    header: 'Nom',
  },
];

type Props = {
  sections: OrganizationSection[];
  org: Organization;
  onUpdateSection: () => void;
};

type Modals = {
  openCreateSection: boolean;
  openUpdateSection: boolean;
  openDeleteSection: boolean;
}

export const ManageOrgSectionsComponent = (props: Props) => {

  const [modals, setModals] = useState<Modals>({openCreateSection: false, openUpdateSection: false, openDeleteSection: false});
  const [selectedSection, setSelectedSection] = useState<undefined | OrganizationSection>(undefined);

  const userCtx = useContext<UserContextProps>(UserContext);

  const onDismiss = () => {
    setModals({
      openCreateSection: false,
      openUpdateSection: false,
      openDeleteSection: false,
    });
    setSelectedSection(undefined);
  }

  const updateModals = (key: keyof Modals, value: boolean) => {
    setModals({
      ...modals,
      [key]: value,
    })
  }

  const onSectionUpdated = () => {
    toast('Section éditer avec succès !', {type: 'success'});
    onDismiss();
  }

  const onSectionDeleted = () => {
    toast('Section supprimer avec succès !', {type: 'success'});
    onDismiss();
  }

  const onSectionCreated = () => {
    toast('Section créer avec succès !', {type: 'success'});
    onDismiss();
  }

  const onClickSectionCell = (row, cell) => {
    setSelectedSection(props.sections.find((a) => a._id === row.id));
    updateModals('openUpdateSection', true);
  }

  return (
    <>
      <CreateOrgSectionModal open={modals.openCreateSection} onDismiss={onDismiss} onSuccess={onSectionCreated} org={props.org} userContext={userCtx}/>
      {selectedSection ? <UpdateOrgSectionModal open={modals.openUpdateSection} onDismiss={onDismiss} onSuccess={onSectionUpdated} org={props.org} section={selectedSection} userContext={userCtx}/> : null}
      {selectedSection ? <DeleteOrgSectionModal open={modals.openDeleteSection} onDismiss={onDismiss} onSuccess={onSectionDeleted} org={props.org} section={selectedSection} userContext={userCtx}/> : null}
      <Tile>
        <p>Une section correspond à la catégorie ou vos DoDs seront rangées.</p>
        <p>par exemple: La Section '2.6 Map' correspond au parent de toutes les DoDs 2.6.x</p>
        <p style={{fontStyle: 'italic'}}>Vous avez la possibilité de changer en temps réel le nom des sections depuis la page de votre Pld</p>
        <DataTable rows={props.sections.map((s) => ({...s, id: s._id})).sort((a, b) => {
          if (b.section > a.section)
            return (-1);
          return 1;
        })} headers={sectionHeaderData} isSortable locale={"fr"}>
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
                <TableToolbarContent>
                  <Button
                    tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                    onClick={() => {updateModals('openCreateSection', true)}}
                    renderIcon={Add}
                    iconDescription={"Add"}
                    size="sm"
                    kind="primary"
                  >Créer une section</Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader style={{whiteSpace: 'nowrap'}} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow {...getRowProps({ row })} key={index}>
                      {row.cells.map((cell) => {
                        return (<TableCell onClick={() => onClickSectionCell(row, cell)} key={cell.id}>{cell.value}</TableCell>)
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </Tile>
    </>
  )
};
