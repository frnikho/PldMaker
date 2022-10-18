import React from "react";
import {ModalProps} from "../../util/Modal";
import { Dod, User, WorkTimeFormat } from "@pld/shared";
import {
  CodeSnippet,
  Column,
  Grid,
  Modal, StructuredListBody, StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
  Tab,
  Tabs
} from "carbon-components-react";

import {TabPanel, TabPanels, TabList} from '@carbon/react';

import {Stack} from '@carbon/react'
import {formatDateHistory, formatLongDate} from "@pld/utils";
import {HistoryHelper} from "../../util/HistoryHelper";

type Props = {
  dod: Dod;
} & ModalProps;

export const PreviewDodModal = (props: Props) => {

  const showHistory = () => {
    if (props.dod.history.length === 0) {
      return (
        <h3 style={{padding: '10px'}}>Il n'y a pas d'historique pour cette DoD</h3>
      )
    }
    return (
      <StructuredListWrapper isCondensed>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Date</StructuredListCell>
            <StructuredListCell head>Détails</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {props.dod.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((history, index) => {
            return (
              <StructuredListRow key={index}>
                <StructuredListCell noWrap>{formatDateHistory(new Date(history.date))}</StructuredListCell>
                <StructuredListCell>
                  {HistoryHelper.replacePlaceholder(history.action, history.owner, props.dod)}
                </StructuredListCell>
                {history.editedFields.length > 0 ? <StructuredListCell style={{maxHeight: '100px'}}>
                  <CodeSnippet aria-multiline={true} style={{height: '100%'}}>
                    {history.editedFields.map((field, index) => {
                      return (<div key={index}>
                        {field.name}: <div style={{display: 'inline', color: 'red'}}>[{field.lastValue}]</div>
                        <div style={{display: 'inline', color: 'green'}}> [{field.value}]</div>
                      </div>);
                    })}
                  </CodeSnippet>
                </StructuredListCell> : null}
              </StructuredListRow>
            )
          })}
        </StructuredListBody>
      </StructuredListWrapper>
    )

  }

  return (
    <Modal
      size={"lg"}
      open={props.open}
      onRequestClose={props.onDismiss}
      passiveModal
      modalHeading={`${props.dod.version} - ${props.dod.title}`}>
      <Tabs>
        <TabList aria-label="List of tabs">
          <Tab>Info</Tab>
          <Tab>Historique</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid>
              <Column lg={9}>
                <Stack gap={3}>
                  <h4 style={{fontWeight: 'bold'}}>En tant que</h4>
                  <p>{props.dod.skinOf}</p>
                  <h4 style={{fontWeight: 'bold'}}>Je veux</h4>
                  <p>{props.dod.want}</p>
                  <h4 style={{fontWeight: 'bold'}}>Description</h4>
                  <p>{props.dod.description}</p>
                  <h4 style={{fontWeight: 'bold'}}>Definition Of Done</h4>
                  {props.dod.descriptionOfDone.map((desc, index) => {
                    return <p key={index}>{`\t - ${desc}`}</p>
                  })}
                  <h4 style={{fontWeight: 'bold'}}>Charge estimée:</h4>
                  {props.dod.estimatedWorkTime.map((wt, index) => {
                    console.log(wt);
                    return (
                      <p key={index}>
                        - <span style={{fontWeight: 'bold'}}>{wt.value} </span>
                        <span>{wt.format ?? WorkTimeFormat.JOUR_HOMME} </span>
                        <span>{(wt.users as User[]).map((user) => {
                          if (user.firstname === undefined || user.lastname === undefined) {
                            return user.email;
                          }
                          return user.firstname;
                        }).join(', ')}</span>
                      </p>)
                  })}
                </Stack>
              </Column>
              <Column lg={3}>
                <Stack gap={4}>
                  <div>
                    <p style={{fontWeight: 'bold'}}>DoD crée le :</p>
                    <p>{formatLongDate(new Date(props.dod.created_date))}</p>
                    {props.dod.owner.email}
                  </div>
                  <div>
                    <p style={{fontWeight: 'bold'}}>Mise à jour le :</p>
                    <p>{formatLongDate(new Date(props.dod.created_date))}</p>
                    {props.dod.history[props.dod.history.length-1]?.owner?.email}
                  </div>
                </Stack>
              </Column>
            </Grid>
          </TabPanel>
          <TabPanel>
            {showHistory()}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Modal>
  );
};
