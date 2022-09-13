import React from "react";
import {ModalProps} from "../../util/Modal";
import {Organization} from "@pld/shared";
import {
  Modal,
  ModalBody, StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper
} from "carbon-components-react";
import {formatLongDate} from "@pld/utils";

export type OrgHistoryModelProps = {
  org: Organization;
} & ModalProps

export type OrgHistoryModelState = {
  short: boolean;
}

export class OrgHistoryModal extends React.Component<OrgHistoryModelProps, OrgHistoryModelState> {

  constructor(props: OrgHistoryModelProps) {
    super(props);
    this.state = {
      short: true,
    }
  }

  override render() {
    return (
      <Modal
        open={this.props.open}
        onRequestClose={this.props.onDismiss}
        onRequestSubmit={() => this.props.onSuccess}
        passiveModal
        modalHeading="Historique">

        <ModalBody>

          <StructuredListWrapper>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>Date</StructuredListCell>
                <StructuredListCell head>Info</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              <StructuredListRow>

                {this.props.org.history.map((history, index) => {
                  return (
                    <StructuredListRow key={index}>
                      <StructuredListCell noWrap>{formatLongDate(new Date(history.date))}</StructuredListCell>
                      <StructuredListCell noWrap>{formatLongDate(new Date(history.date))}</StructuredListCell>
                    </StructuredListRow>)
                })}

                <StructuredListCell noWrap>Row 1</StructuredListCell>
                <StructuredListCell>Row 1</StructuredListCell>
                <StructuredListCell>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dui
                  magna, finibus id tortor sed, aliquet bibendum augue. Aenean posuere
                  sem vel euismod dignissim. Nulla ut cursus dolor. Pellentesque
                  vulputate nisl a porttitor interdum.
                </StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell noWrap>Row 2</StructuredListCell>
                <StructuredListCell>Row 2</StructuredListCell>
                <StructuredListCell>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dui
                  magna, finibus id tortor sed, aliquet bibendum augue. Aenean posuere
                  sem vel euismod dignissim. Nulla ut cursus dolor. Pellentesque
                  vulputate nisl a porttitor interdum.
                </StructuredListCell>
              </StructuredListRow>
            </StructuredListBody>
          </StructuredListWrapper>
        </ModalBody>

      </Modal>
    );
  }

}
