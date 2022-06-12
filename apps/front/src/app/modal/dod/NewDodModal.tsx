import React from "react";
import {
  Button,
  Column,
  FilterableMultiSelect,
  Grid,
  Modal,
  NumberInput,
  Select,
  SelectItem,
  TextArea,
  TextInput,
  Tile
} from "carbon-components-react";
import {FieldData} from "../../util/FieldData";

import {Add, Close} from '@carbon/icons-react';
import {Dod} from "../../../../../../libs/data-access/pld/dod/Dod";
import {Pld} from "../../../../../../libs/data-access/pld/Pld";
import {Organization} from "../../../../../../libs/data-access/organization/Organization";
import {User} from "../../../../../../libs/data-access/user/User";
import {DodApiController} from "../../controller/DodApiController";
import {UserContextProps} from "../../context/UserContext";

export type UserWorkTime = {
  users: string[];
  value: number;
  format: EstimatedWorkTimeFormat,
}

export enum EstimatedWorkTimeFormat {
  JOUR_HOMME = 'J/H',
  HOURS = 'Heures',
}

export type NewDodModalProps = {
  open: boolean;
  onDismiss: () => void;
  onCreatedDod: (newDod: Dod) => void;
  pld: Pld;
  authContext: UserContextProps;
  org: Organization;
  lastDod: Dod[];
  editionDod?: Dod;
}

export type NewDodModalState = {
  preview: boolean;
  versionInput: FieldData<string>;
  titleInput: FieldData<string>;
  skinOfInput: FieldData<string>;
  wantInput: FieldData<string>;
  descriptionInput: FieldData<string>;
  descriptionOfDoneInput: FieldData<string[]>;
  estimatedWorkOfTimeInput: FieldData<UserWorkTime[]>
}

export class NewDodModal extends React.Component<NewDodModalProps, NewDodModalState> {

  constructor(props) {
    super(props);
    this.state = {
      preview: false,
      versionInput: {
        value: ''
      },
      descriptionInput: {
        value: ''
      },
      descriptionOfDoneInput: {
        value: ['']
      },
      estimatedWorkOfTimeInput: {
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
    };
    this.onClickAddDefinitionOfDone = this.onClickAddDefinitionOfDone.bind(this);
    this.onClickDeleteDefinitionOfDone = this.onClickDeleteDefinitionOfDone.bind(this);
    this.onClickAddEstimatedWorkTime = this.onClickAddEstimatedWorkTime.bind(this);
    this.onClickDeleteEstimatedWorkTime = this.onClickDeleteEstimatedWorkTime.bind(this);
    this.onClickPreview = this.onClickPreview.bind(this);
    this.onClickBackPreview = this.onClickBackPreview.bind(this);
    this.onClickCreate = this.onClickCreate.bind(this);
    this.clearField = this.clearField.bind(this);
  }

  private onModalOpen() {
    if (this.props.lastDod.length > 0) {
      this.props.lastDod.sort((dodA, dodB) => dodB.created_date.getDate() - dodA.created_date.getDate());
    }
    this.state.estimatedWorkOfTimeInput.value.push({
      format: EstimatedWorkTimeFormat.JOUR_HOMME,
      users: [(this.props.org.owner as User)._id],
      value: 0
    });
    this.setState({
      estimatedWorkOfTimeInput: this.state.estimatedWorkOfTimeInput
    });
    this.prefillField();
  }

  private clearField() {
    this.setState({
      preview: false,
      versionInput: {
        value: ''
      },
      descriptionInput: {
        value: ''
      },
      descriptionOfDoneInput: {
        value: ['']
      },
      estimatedWorkOfTimeInput: {
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
    });
  }

  private prefillField() {
    if (this.props.editionDod === undefined) {
      this.clearField();
      return;
    }
    this.setState({
      titleInput: {
        value: this.props.editionDod.title,
      },
      versionInput: {
        value: this.props.editionDod.version,
      },
      descriptionInput: {
        value: this.props.editionDod.description,
      },
      wantInput: {
        value: this.props.editionDod.want,
      },
      skinOfInput: {
        value: this.props.editionDod.skinOf
      },
      descriptionOfDoneInput: {
        value: this.props.editionDod.descriptionOfDone,
      },
      estimatedWorkOfTimeInput: {
        value: this.props.editionDod.estimatedWorkTime.map((wt) => {
          return {
            value: wt.value,
            users: wt.users,
            format: EstimatedWorkTimeFormat[wt.format]
          }
        }),
      }
    })
  }

  override componentDidUpdate(prevProps: Readonly<NewDodModalProps>, prevState: Readonly<NewDodModalState>, snapshot?: any) {
    if (this.props.open && !prevProps.open) {
      this.onModalOpen();
    }
  }

  private onClickCreate() {
    //TODO check each field
    console.log(this.state);

    DodApiController.createDod(this.props.authContext.accessToken, {
      owner: this.props.authContext.user?._id ?? '',
      descriptionOfDone: this.state.descriptionOfDoneInput.value,
      pldOwner: this.props.pld._id,
      skinOf: this.state.skinOfInput.value,
      title: this.state.titleInput.value,
      version: this.state.versionInput.value,
      want: this.state.wantInput.value,
      description: this.state.descriptionInput.value,
      estimatedWorkTime: this.state.estimatedWorkOfTimeInput.value.map((wt) => (
        {
          value: wt.value,
          users: wt.users,
          format: wt.format,
        }
      )),
    }, (dod, error) => {
      if (!error && dod !== null) {
        this.props.onCreatedDod(dod);
      }
      if (dod === null) {
        console.error(error);
      }
    });

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

  private onClickAddEstimatedWorkTime() {
    const values: UserWorkTime[] = this.state.estimatedWorkOfTimeInput.value;
    values.push({
      format: EstimatedWorkTimeFormat.JOUR_HOMME,
      users: [(this.props.org.owner as User)._id],
      value: 0
    });
    this.setState({
      estimatedWorkOfTimeInput: {
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

  private onClickDeleteEstimatedWorkTime(index: number) {
    const values: UserWorkTime[] = this.state.estimatedWorkOfTimeInput.value;
    values.splice(index, 1);
    this.setState({
      estimatedWorkOfTimeInput: {
        value: values,
      }
    })
  }

  private showDefinitionsOfDoneText() {
    return this.state.descriptionOfDoneInput.value.map((dod, index) => {
      return (
        <Grid key={index} style={{marginTop: '12px'}}>
          <Column lg={11} md={7}>
            <TextInput id={"dod-"} labelText={""} value={dod} onChange={(e) => {
              const value = this.state.descriptionOfDoneInput.value;
              value[index] = e.currentTarget.value;
              this.setState({
                descriptionOfDoneInput: {
                  value: value,
                }
              })
            }}/>
          </Column>
          <Column lg={1} style={{}}>
            <Button iconDescription={"Supprimer la line"} kind={"tertiary"} hasIconOnly renderIcon={Close} onClick={() => this.onClickDeleteDefinitionOfDone(index)} size={"sm"}/>
          </Column>
        </Grid>
      )
    })
  }

  private showEstimatedWorkTime() {
    return this.state.estimatedWorkOfTimeInput.value.map((dod, index) => {
      return (
        <Grid key={index} style={{marginTop: '12px', alignItems: 'center'}}>
          <Column lg={5} md={3}>
            <FilterableMultiSelect
              items={(this.props.org.members as User[]).concat([this.props.org.owner as User]).map((user) => ({label: user.email, value: user._id}))}
              placeholder={"Email de l'utilisateur..."}
              id="dod-estimated-work-time-user"
              selectedItems={dod.users.map((user) => {return {label: user, value: user}})}
              onChange={(e) => {
                const value = this.state.estimatedWorkOfTimeInput.value;
                value[index].users = e.selectedItems.map((item) => (item.value));
                this.setState({
                  estimatedWorkOfTimeInput: {
                    value: value
                  }
                })
              }}
              selectionFeedback="top-after-reopen"/>
          </Column>
          <Column lg={3} md={2}>
            <NumberInput id={"dod-estimated-work-time-time"} iconDescription={""} value={this.state.estimatedWorkOfTimeInput.value[index].value} onChange={(e) => {
              const value = this.state.estimatedWorkOfTimeInput.value;
              value[index].value = e.imaginaryTarget.value;
              this.setState({
                estimatedWorkOfTimeInput: {
                  value: value
                }
              })
            }}/>
          </Column>
          <Column lg={3} md={2}>
            <Select
              style={{marginBottom: '10px'}}
              id="dod-estimated-work-time-format"
              onChange={(e) => {
                const value = this.state.estimatedWorkOfTimeInput.value;
                value[index].format = EstimatedWorkTimeFormat[e.currentTarget.value];
                this.setState({
                  estimatedWorkOfTimeInput: {
                    value: value,
                  }
                })
              }}
              labelText="">
              <SelectItem value={EstimatedWorkTimeFormat.JOUR_HOMME} text="J/H (Jour Homme)"/>
              <SelectItem value={EstimatedWorkTimeFormat.HOURS} text="Heures"/>
            </Select>
          </Column>
          <Column lg={1} md={1} style={{}}>
            <Button iconDescription={"Supprimer la line"} kind={"tertiary"} hasIconOnly renderIcon={Close} onClick={() => this.onClickDeleteEstimatedWorkTime(index)} size={"sm"}/>
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
        <Grid>
          <Column lg={3} md={3}>
            <TextInput id={"dod-version"} labelText={"Version"} min={0} value={this.state.versionInput.value} onChange={(e) => {
              this.setState({
                versionInput: {
                  value: e.currentTarget.value,
                }
              })
            }}/>
          </Column>
          <Column lg={8} md={5}>
            <TextInput id={"dod-title"} labelText={"Nom du dod"} value={this.state.titleInput.value} onChange={(e) => {
              this.setState({
                titleInput: {
                  value: e.currentTarget.value
                }
              })
            }}/>
          </Column>
        </Grid>
        <Grid>
          <Column lg={3} md={3}>
            <TextInput id={"dod-skinOf"} labelText={"En tant que..."} value={this.state.skinOfInput.value} onChange={(e) => {
              this.setState({
                skinOfInput: {
                  value: e.currentTarget.value,
                }
              })
            }}/>
          </Column>
          <Column lg={8} md={5}>
            <TextInput id={"dod-want"} labelText={"Je veut pouvoir..."} value={this.state.wantInput.value} onChange={(e) => {
              this.setState({
                wantInput: {
                  value: e.currentTarget.value
                }
              })
            }}/>
          </Column>
        </Grid>
        <TextArea id={"dod-description"} labelText={"Description"} value={this.state.descriptionInput.value} onChange={(e) => {
          this.setState({
            descriptionInput: {
              value: e.currentTarget.value
            }
          });
        }}/>
        <p style={{marginTop: '10px'}}>Définition of Done</p>
        <Tile>
          {this.showDefinitionsOfDoneText()}
          <Button style={{marginTop: '20px'}} size={"sm"} iconDescription={"Ajouter une définition"} kind={"secondary"}  onClick={this.onClickAddDefinitionOfDone} hasIconOnly renderIcon={Add}/>
        </Tile>

        <p style={{marginTop: '10px'}}>temps estimé</p>
        <Tile>
          {this.showEstimatedWorkTime()}
          <Button style={{marginTop: '20px'}} size={"sm"} iconDescription={"Ajouter une définition"} kind={"secondary"}  onClick={this.onClickAddEstimatedWorkTime} hasIconOnly renderIcon={Add}/>
        </Tile>
      </>
    )
  }

  override render() {
    return (
      <Modal
        size={"md"}
        open={this.props.open}
        primaryButtonText={"Créer"}
        onRequestSubmit={this.onClickCreate}
        secondaryButtonText={"Fermer"}
        onRequestClose={this.props.onDismiss}
        modalHeading="Créer un nouveau dod">

        {this.showPreview()}
        {this.showEdit()}

      </Modal>
    );
  }

}
