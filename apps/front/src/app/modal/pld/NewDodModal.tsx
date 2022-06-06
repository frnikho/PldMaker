import React from "react";
import {Dod} from "../../../../../../libs/data-access/pld/dod/Dod";
import {Button, Column, Grid, Modal, NumberInput, TextArea, TextInput, Tile} from "carbon-components-react";
import {FieldData} from "../../util/FieldData";

import {Add, Close} from '@carbon/icons-react';

export type NewDodModalProps = {
  open: boolean;
  onDismiss: () => void;
  onCreatedDod: (newDod: Dod) => void;
  lastDod: Dod[]
}

export type NewDodModalState = {
  preview: boolean;
  versionInput: FieldData<number>;
  titleInput: FieldData<string>;
  skinOfInput: FieldData<string>;
  wantInput: FieldData<string>;
  descriptionInput: FieldData<string>;
  descriptionOfDoneInput: FieldData<string[]>;
  estimatedWorkTime: FieldData<unknown[]>;
}

export class NewDodModal extends React.Component<NewDodModalProps, NewDodModalState> {

  constructor(props) {
    super(props);
    this.state = {
      preview: false,
      versionInput: {
        value: 0,
      },
      descriptionInput: {
        value: ''
      },
      descriptionOfDoneInput: {
        value: ['']
      },
      estimatedWorkTime: {
        value: []
      },
      skinOfInput: {
        value: ''
      },
      titleInput: {
        value: ''
      },
      wantInput: {
        value: ''
      }
    }
    this.onClickAddDefinitionOfDone = this.onClickAddDefinitionOfDone.bind(this);
    this.onClickDeleteDefinitionOfDone = this.onClickDeleteDefinitionOfDone.bind(this);
    this.onClickPreview = this.onClickPreview.bind(this);
    this.onClickBackPreview = this.onClickBackPreview.bind(this);
    this.onClickCreate = this.onClickCreate.bind(this);
  }

  override componentDidMount() {

  }

  private onClickCreate() {

  }

  private onClickPreview() {
    this.setState({
      preview: true,
    })
  }

  private onClickBackPreview() {
    this.setState({
      preview: false,
    })
  }

  private onClickAddDefinitionOfDone() {
    const values: string[] = this.state.descriptionOfDoneInput.value;
    values.push('');
    this.setState({
      descriptionOfDoneInput: {
        value: values
      }
    })
  }

  private onClickDeleteDefinitionOfDone(index: number) {
    const values: string[] = this.state.descriptionOfDoneInput.value;
    values.splice(index, 1);
    this.setState({
      descriptionOfDoneInput: {
        value: values,
      }
    })
  }

  private showDefinitionsOfDoneText() {
    return this.state.descriptionOfDoneInput.value.map((dod, index) => {
      return (
        <Grid key={index} style={{marginTop: '12px'}}>
          <Column lg={9}>
            <TextInput id={"dod-"} labelText={""}/>
          </Column>
          <Column lg={1} style={{}}>
            <Button iconDescription={"Supprimer la line"} kind={"danger--tertiary"} hasIconOnly renderIcon={Close} onClick={() => this.onClickDeleteDefinitionOfDone(index)} size={"sm"}/>
          </Column>
        </Grid>
      )
    })
  }

  private showPreview() {
    if (!this.state.preview) {
     return;
    }
    return (
      <Button hasIconOnly renderIcon={Close} iconDescription={"Close"} onClick={this.onClickBackPreview}/>
    )
  }

  private showEdit() {
    if (this.state.preview)
      return;
    return (
      <>
        <NumberInput id={"dod-version"} label={"Version"} value={this.state.versionInput.value}/>
        <TextInput id={"dod-title"} labelText={"Nom du dod"}/>
        <TextInput id={"dod-skinOf"} labelText={"En tant que..."}/>
        <TextInput id={"dod-want"} labelText={"Je veut pouvoir..."}/>
        <TextArea id={"dod-description"} labelText={"Description"}/>


        <p style={{marginTop: '10px'}}>Définition of Done</p>
        <Tile>
          {this.showDefinitionsOfDoneText()}
          <Button style={{marginTop: '10px'}} size={"sm"} iconDescription={"Ajouter une définition"} kind={"secondary"}  onClick={this.onClickAddDefinitionOfDone} hasIconOnly renderIcon={Add}/>
        </Tile>



        {/*//TODO descriptionOfDone*/}</>
    )
  }

  override render() {
    return (
      <Modal
        size={"md"}
        open={this.props.open}
        primaryButtonText={"Créer"}
        onSubmit={this.onClickCreate}
        secondaryButtons={[
          {
            buttonText: 'Fermer',
            onClick: this.props.onDismiss,
          },
          {
            buttonText: 'Preview',
            onClick: this.onClickPreview,
          },
        ]}
        onRequestClose={this.props.onDismiss}
        modalHeading="Créer un nouveau dod">

        {this.showPreview()}
        {this.showEdit()}

      </Modal>
    );
  }

}
