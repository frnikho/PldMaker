import React, { Fragment, useEffect, useState } from "react";
import { Modal, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "carbon-components-react";
import { Dod, DodStatus, Organization, OrganizationSection, Pld, User } from "@pld/shared";
import { CreateOrgSectionModal } from "../org/CreateOrgSectionModal";
import { UpdateOrgSectionModal } from "../org/UpdateOrgSectionModal";
import { PreviewDodModal } from "../dod/PreviewDodModal";
import { ModalProps } from "../../util/Modal";
import { useModals } from "../../hook/useModals";

type UserResume = {
  user: User;
  dod: Dod[];
}

type DodCell = {
  type: 'dod' | 'section';
  version: string;
  dod: Dod | undefined;
  section: OrganizationSection | undefined;
}

type Props = {
  org: Organization;
  sections: OrganizationSection[];
  dodColors: DodStatus[];
  pld: Pld;
  dods: Dod[];
  hide: (show: boolean) => void;
  reload: () => void;
} & ModalProps;

export const ResumePldModal = (props: Props) => {

  const {dodPreview, createSection, updateSection, updateModals} = useModals({dodPreview: false, createSection: false, updateSection: false});
  const [selectedDod, setSelectedDod] = useState<Dod | undefined>(undefined);
  const [selectedSection, setSelectedSection] = useState<OrganizationSection | undefined>(undefined);
  const [resume, setResume] = useState<UserResume[]>([]);

  useEffect(() => init(), [props.open]);

  const init = () => {
    const users: User[] = getUsers(props.org);
    setResume(users.map((user): UserResume => {
      return {
        user: user,
        dod: getDods(props.dods).filter((dod) => (dod.estimatedWorkTime.some((wt) => wt.users.some((a) => a._id === user._id))))
      }
    }));
  }

  const getTableHeader = () => {
    return resume.map((value) => {
      const hours: number = value.dod.map((dod) => {
        const abc = dod.estimatedWorkTime.map((wt) => {
          if (wt.users.some((a) => value.user._id === a._id))
            return parseFloat(wt.value / wt.users.length as unknown as string);
          return 0;
        })
        return abc;
      }).flat().reduce((a, b) => a + b, 0);
      return (
        <TableHeader id={value.user._id} key={value.user._id}>
          <p style={{ fontWeight: 'bold' }}>
            {`${value.user.firstname} ${value.user.lastname[0]}`}
          </p>
          <p>
            {hours.toFixed(1)} J/H
          </p>
        </TableHeader>
      )
    })
  }

  const getDods = (dod: Dod[]) => {
    return dod.sort((a, b) => {
      if (b.version > a.version)
        return -1;
      else
        return 1;
    });
  }

  const getUsers = (org: Organization) => {
    return [org.owner, ...org.members].sort((a, b) => {
      if (a.firstname < b.firstname)
        return -1;
      else
        return 1;
    })
  }

  const showTableCellSection = (section: OrganizationSection) => {
    return (
      <TableCell onDoubleClick={() => {
        setSelectedSection(section);
        props.onDismiss();
        updateModals('updateSection', true);
      }}>
        <p style={{ fontWeight: 'bold' }}>{section.section} {section.name}</p>
      </TableCell>
    )

  }

  const getTableBody = () => {
    const section: DodCell[] = props.sections.map((section) => ({ type: 'section', section: section, dod: undefined, version: section.section }));
    const DoDs: DodCell[] = (getDods(props.dods).map((dod) => ({ dod, type: 'dod', version: dod.version })) as DodCell[]).concat(...section).sort((a, b) => {
      return compare(a.version, b.version);
    });

    return DoDs.map((a, index) => {
      if (a.type === 'dod') {
        const dod = a.dod as Dod;
        const color = props.dodColors.find((a) => dod.status._id === a._id);
        return (
          <Fragment key={index}>
            <TableRow id={'dod_' + dod._id} key={index + dod._id}>
              <TableCell style={{ cursor: 'pointer' }} onClick={() => {
                props.onDismiss();
                setSelectedDod(dod);
                updateModals('dodPreview', true);
              }} key={dod._id + '_name'}>
                <div className="square" style={{
                  height: '12px',
                  width: '12px',
                  marginRight: 10,
                  backgroundColor: `#${color?.color}`,
                  borderRadius: '50%',
                  display: 'inline-block',
                }} />
                {dod.version} {dod.title} </TableCell>
              <TableCell>{dod.estimatedWorkTime.map((a) => a.users.map(() => parseFloat(String(a.value / a.users.length)))).flat().reduce((a, b) => a + b, 0).toFixed(1)}</TableCell>
              {getUsers(props.org).map((user) => {
                const hours = dod.estimatedWorkTime.map((wt) => {
                  if (wt.users.some((a) => user._id === a._id))
                    return parseFloat(wt.value / wt.users.length as unknown as string);
                  return 0;
                }).flat().reduce((a, b) => a + b, 0);
                return (
                  <TableCell key={dod._id + user._id}>
                    {hours !== 0 ? hours.toFixed(1) : '-'}
                  </TableCell>
                )
              })}
            </TableRow>
          </Fragment>
        )
      } else {
        const section = a.section as OrganizationSection;
        return <TableRow key={index}>
          {showTableCellSection(section)}
          <TableCell />
          {getUsers(props.org).map((u, index) => <TableCell key={'user_blank_cell_' + index} />)}
        </TableRow>
      }
    });
  }

  const compare = (a: string, b: string) => {
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

  const showModals = () => {
    return (
      <>
        {selectedDod ? <PreviewDodModal dod={selectedDod} open={dodPreview} onDismiss={() => {
          updateModals('dodPreview', false);
          props.hide(true);
        }} onSuccess={() => {
          props.hide(true);
          updateModals('createSection', false);
        }} /> : null}
        <CreateOrgSectionModal section={selectedSection?.section} open={createSection} onDismiss={() => {
          updateModals('createSection', false);
          props.hide(true);
        }} onSuccess={() => {
          props.reload();
          props.hide(true);
          updateModals('createSection', false);
          }} org={props.org}/>
        {selectedSection ? <UpdateOrgSectionModal section={selectedSection} open={updateSection} onDismiss={() => {
          updateModals('updateSection', false);
          props.hide(true);
        }} onSuccess={() => {
          props.reload();
          props.hide(true);
          updateModals('updateSection', false);
        }} org={props.org}/> : null}
      </>
    )
  }

  return (
    <>
      {showModals()}
      <Modal
        size={"lg"}
        open={props.open}
        onRequestClose={() => props.onDismiss()}
        passiveModal
        modalHeading="Récapitulatif des J/H">
        <Table size="md" useZebraStyles={false}>
          <TableHead>
            <TableRow id={"DodHeader"} key={"DodHeader"}>
              <TableHeader id={"DodHeaderName"} key={"DodHeaderName"}>
                DoDs
              </TableHeader>
              <TableHeader>
                <p style={{ fontWeight: 'bold' }}>
                  Total
                </p>
                <p>
                  {props.dods.map((dod) => dod.estimatedWorkTime.map((wt) => wt.users.map(() => parseFloat(String(wt.value / wt.users.length)))).flat()).flat().reduce((a, b) => a + b, 0)} J/H
                </p>
              </TableHeader>
              {getTableHeader()}
            </TableRow>
          </TableHead>
          <TableBody>
            {getTableBody()}
          </TableBody>
        </Table>
      </Modal>
    </>
  )
};
