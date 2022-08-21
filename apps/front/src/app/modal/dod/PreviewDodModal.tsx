import React from "react";
import {ModalProps} from "../../util/Modal";
import {Dod, User} from "@pld/shared";
import {
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
import {formatDateHistory, formatLongDate, formatShortDate} from "@pld/utils";
import {HistoryHelper} from "../../util/HistoryHelper";

export type PreviewDodProps = {
  dod: Dod;
} & ModalProps;

export type PreviewDodState = unknown

export class PreviewDodModal extends React.Component<PreviewDodProps, PreviewDodState> {

  constructor(props) {
    super(props);
  }

  private showHistory() {
    if (this.props.dod.history.length === 0) {
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
          {this.props.dod.history.map((history, index) => {
            return (
              <StructuredListRow key={index}>
                <StructuredListCell noWrap>{formatDateHistory(new Date(history.date))}</StructuredListCell>
                <StructuredListCell>
                  {HistoryHelper.replacePlaceholder(history.action, history.owner, this.props.dod)}
                </StructuredListCell>
              </StructuredListRow>
            )
          })}
        </StructuredListBody>
      </StructuredListWrapper>
    )

  }

  private showInfo() {
    return (
      <Grid>
        <Column lg={9}>
          <Stack gap={2}>
            <h4>En tant que</h4>
            <p>{this.props.dod.skinOf}</p>
            <h4>Je veux</h4>
            <p>{this.props.dod.want}</p>
            <h4>Description:</h4>
            <p>{this.props.dod.description}</p>
            <h4>Definition Of Done:</h4>
            {this.props.dod.descriptionOfDone.map((desc, index) => {
              return <p key={index}>{`\t - ${desc}`}</p>
            })}
            <h4>Charge estimée:</h4>
            {this.props.dod.estimatedWorkTime.map((wt, index) => {
              return (
                <p key={index}>
                  - <span style={{fontWeight: 'bold'}}>{wt.value} </span>
                  <span>{wt.format} </span>
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
          <p>DoD crée le</p>
          <p>{formatShortDate(new Date(this.props.dod.created_date))}</p>
          <p>Mise à jour le</p>
          <p>{formatLongDate(new Date(this.props.dod.created_date))}</p>
        </Column>
      </Grid>
    )
  }

  override render() {
    return (
      <Modal
        size={"md"}
        open={this.props.open}
        onRequestClose={this.props.onDismiss}
        passiveModal
        modalHeading={`${this.props.dod.version} - ${this.props.dod.title}`}>
        <Tabs>
          <TabList aria-label="List of tabs">
            <Tab>Info</Tab>
            <Tab>Historique</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {this.showInfo()}
            </TabPanel>
            <TabPanel>
              {this.showHistory()}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Modal>
    );
  }

}
