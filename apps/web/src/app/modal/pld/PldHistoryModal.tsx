import React from "react";
import {CodeSnippet,
  Modal, StructuredListBody, StructuredListCell, StructuredListHead, StructuredListRow,
  StructuredListWrapper,
} from "carbon-components-react";
import {ModalProps} from "../../util/Modal";

import {Dod, EditedField, Pld, Organization} from "@pld/shared";
import {
  formatDateHistory,
} from "@pld/utils";
import {HistoryHelper} from "../../util/HistoryHelper";

export type HistoryDetails = {
  date: Date;
  message: JSX.Element;
  editedFields: EditedField[];
  action: string;
}

type Props = {
  org: Organization;
  pld: Pld;
  dods: Dod[];
} & ModalProps;

export const PldHistoryModal = (props: Props) => {

  const showDetails = () => {
    const details: HistoryDetails[] = [];
    props.dods.forEach((dod) => {
      dod.history.forEach((history) => {
        details.push({
          action: history.action,
          editedFields: history.editedFields,
          date: new Date(history.date),
          message: (<p>{HistoryHelper.replacePlaceholder(history.action, history.owner, dod)}</p>)
        })
      })
    })
    props.pld.history.forEach((history) => {
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

  return (
    <Modal
      size={"lg"}
      open={props.open}
      onRequestClose={props.onDismiss}
      onRequestSubmit={props.onSuccess}
      passiveModal
      modalHeading="Derniers changements">
      {showDetails()}
    </Modal>
  );
};
