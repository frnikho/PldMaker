import React from "react";
import {ModalProps} from "../../util/Modal";
import {Modal, MultiSelect, NumberInput, TextArea, TextInput} from "carbon-components-react";
import {FieldData} from "../../util/FieldData";
import {RequiredUserContextProps} from "../../context/UserContext";
import {PldApiController} from "../../controller/PldApiController";
import {Organization} from "../../../../../../libs/data-access/organization/Organization";
import {toast} from "react-toastify";
import {Pld} from "../../../../../../libs/data-access/pld/Pld";

import {Stack} from '@carbon/react'

export type AddRevisionPldModalProps = {
  version: number;
  org: Organization;
  pld: Pld;
  versionShifting: number;
} & ModalProps & RequiredUserContextProps;

export type AddRevisionPldModalState = {
  comments: FieldData<string>;
  sections: FieldData<string[]>;
  version: FieldData<number>;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("fr") + " à " + date.toLocaleTimeString("fr");
}

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
      version: {
        value: this.props.version,
      }
    };
    this.onClickAddRevision = this.onClickAddRevision.bind(this);
  }

  private onClickAddRevision() {
    PldApiController.addRevision(this.props.userContext.accessToken, this.props.pld._id, {
      owner: this.props.userContext.user?._id ?? 'null',
      comments: this.state.comments.value,
      version: this.state.version.value,
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
        primaryButtonText={"Ajouter la révision"}
        onRequestSubmit={this.onClickAddRevision}
        secondaryButtonText={"Fermer"}
        onRequestClose={this.props.onDismiss}
        modalHeading="Ajouter une révision">

        <Stack gap={6}>
          <TextInput id={"date"} labelText={"Date"} value={formatDate(new Date())}/>
          <NumberInput
            invalid={this.state.version.error !== undefined}
            invalidText={this.state.version.error}
            id={"version"} label={"Version"} iconDescription={""} min={this.props.version} step={this.props.versionShifting} value={this.state.version.value} onChange={(e) => {
            this.setState({
              version: {
                value: e.imaginaryTarget.value,
              }
            })
          }}/>
          <TextInput id={"auteur"} labelText={"Auteur"} value={this.props.org.name}/>

          <MultiSelect
            label="Sections modifiées:"
            id="revision-section"
            invalid={this.state.sections.error !== undefined}
            invalidText={this.state.sections.error}
            items={[{label: 'Toutes'}]}
            onChange={(e) => {
              this.setState({
                sections: {
                  value: e.selectedItems.map((a) => a.label)
                }
              })
            }}
          />
          <TextArea rows={4} id={"comments"} onChange={(e) => {
            this.setState({
              comments: {
                value: e.currentTarget.value,
              }
            })
          }} labelText={"Commentaires"} required={false}/>
        </Stack>
      </Modal>
    );
  }

}
