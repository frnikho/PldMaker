import React from "react";
import {ModalProps} from "../../util/Modal";
import {Modal, MultiSelect, TextArea} from "carbon-components-react";
import {FieldData} from "../../util/FieldData";
import {RequiredUserContextProps} from "../../context/UserContext";
import {PldApiController} from "../../controller/PldApiController";
import {Organization, Pld} from "@pld/shared";
import {toast} from "react-toastify";

import {Stack} from '@carbon/react'
import {RequiredLabel} from "../../util/Label";

export type AddRevisionPldModalProps = {
  version: number;
  org: Organization;
  pld: Pld;
  versionShifting: number;
} & ModalProps & RequiredUserContextProps;

export type AddRevisionPldModalState = {
  comments: FieldData<string>;
  sections: FieldData<string[]>;
};

export class AddRevisionPldModal extends React.Component<AddRevisionPldModalProps, AddRevisionPldModalState> {

  constructor(props: AddRevisionPldModalProps) {
    super(props);
    this.state = {
      sections: {
        value: [],
      },
      comments: {
        value: ''
      },
    };
    this.onClickAddRevision = this.onClickAddRevision.bind(this);
  }

  private onClickAddRevision() {
    PldApiController.addRevision(this.props.userContext.accessToken, this.props.org._id, this.props.pld._id, {
      owner: this.props.userContext.user?._id ?? 'null',
      comments: this.state.comments.value,
      version: parseFloat((this.props.versionShifting + this.props.version).toFixed(2)),
      sections: this.state.sections.value,
      created_date: new Date(),
      currentStep: this.props.pld.currentStep,
    }, (pld, error) => {
      if (error) {
        toast(error.error, {type: 'error'});
      }
      if (pld !== null) {
        this.props.onSuccess(pld);
      }
    })
  }

  override render() {
    return (
      <Modal
        size={"md"}
        open={this.props.open}
        primaryButtonText={"Ajouter"}
        onRequestSubmit={this.onClickAddRevision}
        secondaryButtonText={"Fermer"}
        onRequestClose={this.props.onDismiss}
        modalHeading="Ajouter une révision">

        <Stack gap={4}>
          <MultiSelect
            label={this.state.sections.value.length === 0 ? "Veuillez choisir la/les section(s) modifiée(s)" : this.state.sections.value.join(', ')}
            titleText={<RequiredLabel message={"Sections modifiées"}/>}
            id="revision-section"
            invalid={this.state.sections.error !== undefined}
            invalidText={this.state.sections.error}
            items={['Toutes', 'DoDs', 'Informations', 'Status'].map((e) => ({label: e}))}
            onChange={(e) => {
              this.setState({
                sections: {
                  value: e.selectedItems.map((a) => a.label)
                }
              })
            }}
          />
          <TextArea
            labelText={<RequiredLabel message={"Commentaires"}/>}
            rows={4} id={"comments"} onChange={(e) => {
            this.setState({
              comments: {
                value: e.currentTarget.value,
              }
            })
          }}/>
        </Stack>
      </Modal>
    );
  }

}
