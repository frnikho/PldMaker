import React from "react";
import {CodeSnippet,
  Modal, StructuredListBody, StructuredListCell, StructuredListHead, StructuredListRow,
  StructuredListWrapper,
  Tab,
  Tabs,
  Tile,
  Tooltip,
} from "carbon-components-react";
import {ModalProps} from "../../util/Modal";

import {TabList, TabPanels, TabPanel} from '@carbon/react';
import {Organization} from "../../../../../../libs/data-access/organization/Organization";
import {Pld} from "../../../../../../libs/data-access/pld/Pld";
import { ResponsiveCalendar } from "@nivo/calendar";
import {Dod, EditedField} from "../../../../../../libs/data-access/dod/Dod";
import {
  formatDateCharts,
  formatDateHistory,
  formatLongDate,
  isSameDate
} from "../../../../../../libs/utility/DateUtility";
import {HistoryHelper} from "../../util/HistoryHelper";
import {PldHistoryAction} from "../../../../../../libs/data-access/pld/PldHistory";
import {OrgHistoryAction} from "../../../../../../libs/data-access/organization/OrgHistory";
import {DodHistoryAction} from "../../../../../../libs/data-access/dod/DodHistory";
import {User} from "../../../../../../libs/data-access/user/User";

export type HistoryDetails = {
  date: Date;
  message: JSX.Element;
  editedFields: EditedField[];
  action: string;
}

const CustomTooltip = (data, dods: Dod[]) => {
  if (data.value === undefined) return null
  return (
    <Tooltip defaultOpen={true} style={{width: '200px'}}>
      <Tile>
        <p>{data.day} : {data.value}</p>
        {dods.map((dod, index) => {
          return (<p key={index}>{dod.version} {dod.title}</p>)
        })}
      </Tile>
    </Tooltip>);
}

export type PldHistoryProps = {
  org: Organization;
  pld: Pld;
  dod: Dod[];
} & ModalProps;

export type PldHistoryState = unknown;

export class PldHistoryModal extends React.Component<PldHistoryProps, PldHistoryState> {

  constructor(props) {
    super(props);
  }

  private showResume() {
    const createdDodData = this.props.dod.map((dod) => {
      return {
        value: 1,
        day: formatDateCharts(new Date(dod.created_date))
      }
    }).map((dod, index, rest) => {
      const sameDayDod = rest.filter((otherDod) => {
        return otherDod.day === dod.day;
      });
      return {
        value: sameDayDod.length,
        day: dod.day
      }
    })
    return (
      <>
        <h4>DoDs crées</h4>
        <div style={{height: '200px'}}>
          <ResponsiveCalendar
            data={createdDodData}
            from={new Date(this.props.pld.created_date ?? '')}
            to={new Date()}
            tooltip={(data) => CustomTooltip(data, this.props.dod.filter((dod) => isSameDate(new Date(dod.created_date), new Date(data.day))))}
            emptyColor="#eeeeee"
            colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
            margin={{right: 40, left: 40,  top: 10, bottom: 10}}
            monthBorderColor="#ffffff"
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'row',
                translateY: 36,
                itemCount: 4,
                itemWidth: 42,
                itemHeight: 36,
                itemsSpacing: 14,
                itemDirection: 'right-to-left'
              }
            ]}
          />
        </div>
      </>
    )
  }

  private showDetails() {
    const details: HistoryDetails[] = [];
    this.props.dod.forEach((dod) => {
      dod.history.forEach((history) => {
        console.log(history.action);
        details.push({
          action: history.action,
          editedFields: history.editedFields,
          date: new Date(history.date),
          message: (<p>{HistoryHelper.replacePlaceholder(history.action, history.owner, dod)}</p>)
        })
      })
    })
    this.props.pld.history.forEach((history) => {
      details.push({
        action: history.action,
        editedFields: history.editedFields,
        date: new Date(history.date),
        message: (<p style={{display: 'inline'}}>
          {HistoryHelper.replacePlaceholder(history.action, history.owner, history.dod)}
        </p>)
      })
      details.push(
      );
    })
    return (
      <StructuredListWrapper>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head></StructuredListCell>
            <StructuredListCell></StructuredListCell>
            <StructuredListCell></StructuredListCell>
            <StructuredListCell></StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          <StructuredListRow>
            {details.sort((a1, a2) => {
              return (a2.date.getTime() - a1.date.getTime());
            }).map((detail, index) => (
              <StructuredListRow key={index}>
                <StructuredListCell noWrap>
                  <p style={{fontWeight: 'bold'}}>
                    {formatDateHistory(new Date(detail.date))}
                  </p>
                </StructuredListCell>
                <StructuredListCell noWrap>
                  {detail.message}
                </StructuredListCell>
                {detail.editedFields.length > 0 ? <StructuredListCell style={{maxHeight: '100px'}}>
                  <CodeSnippet aria-multiline={true} style={{height: '100%'}}>
                    {detail.editedFields.map((field, index) => {
                      return (<div key={index}>
                          {field.name}: <div style={{display: 'inline', color: 'red'}}>[{field.lastValue}]</div>
                          <div style={{display: 'inline', color: 'green'}}> [{field.value}]</div>
                        </div>);
                    })}
                  </CodeSnippet>
                </StructuredListCell> : null}

              </StructuredListRow>
            ))}

          </StructuredListRow>
        </StructuredListBody>
      </StructuredListWrapper>
    )
  }

  override render() {
    return (
      <Modal
        size={"lg"}
        open={this.props.open}
        onRequestClose={this.props.onDismiss}
        onRequestSubmit={() => this.props.onSuccess}
        passiveModal
        modalHeading="Derniers changements">
        <Tabs>
          <TabList aria-label={"List"}>
            <Tab>Résumé</Tab>
            <Tab>Détaillé</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{this.showResume()}</TabPanel>
            <TabPanel>{this.showDetails()}</TabPanel>
          </TabPanels></Tabs>
      </Modal>
    );
  }
}
