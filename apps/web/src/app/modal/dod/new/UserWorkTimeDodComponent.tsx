import {
  Button, FilterableMultiSelect,
  NumberInput,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow, StructuredListWrapper
} from "carbon-components-react";
import React from "react";
import { Organization } from "@pld/shared";
import { WorkTime } from "../NewDodModal";

import {TrashCan} from '@carbon/icons-react';

type Props = {
  workTime: WorkTime[];
  org: Organization;
  onWtChanged: (wtIndex: number, newWt: WorkTime) => void;
  onWtDeleted: (wtIndex: number) => void;
};

export const UserWorkTimeDodComponent = (props: Props) => {

  const availableItems = [...props.org.members, props.org.owner].map((user) => ({ email: user.email, id: user._id, }));

  return (
    <StructuredListWrapper>
      <StructuredListHead>
        <StructuredListRow head>
          <StructuredListCell head>Utilisateurs</StructuredListCell>
          <StructuredListCell head>Temps estimés</StructuredListCell>
          <StructuredListCell head>Actions</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        {props.workTime.map((wt, index) => {
          return (
            <StructuredListRow key={index} style={{margin: 0}}>
              <StructuredListCell>
                <div style={{minWidth: 500}}>
                  <FilterableMultiSelect
                    id={'user-select-worktime'}
                    placeholder={wt.users.map((user) => user.email).join(', ')}
                    titleText={"Utilisateurs"}
                    items={availableItems}
                    itemToString={(item) => item.email}
                    label={wt.users.map((user) => user.email).join(', ')}
                    selectedItems={wt.users ?? []}
                    onChange={({selectedItems}) => {
                      wt.users = selectedItems;
                      props.onWtChanged(index, wt);
                    }}/>
                </div>
              </StructuredListCell>
              <StructuredListCell>
                <NumberInput min={0} max={50} label={"J/H"} id={"dod-estimated-work-time-time"} iconDescription={""} value={wt.value} onChange={(evt, {value}) => {
                  wt.value = Number(value);
                  props.onWtChanged(index, wt);
                }}/>
              </StructuredListCell>
              <StructuredListCell style={{display: 'flex', flexDirection: 'column'}}>
                <br/>
                <Button style={{marginTop: 6}} size={'md'} kind={'ghost'} iconDescription={"Supprimer"} onClick={() => props.onWtDeleted(index)} hasIconOnly renderIcon={TrashCan}/>
              </StructuredListCell>
            </StructuredListRow>
          )
        })}
      </StructuredListBody>
    </StructuredListWrapper>
  )
};
