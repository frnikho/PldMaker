import React from "react";
import {
  Button,
  Column, ComboBox,
  FilterableMultiSelect,
  Grid,
  Modal,
  NumberInput,
  Select,
  SelectItem,
  TextArea,
  TextInput
} from "carbon-components-react";
import {FieldData} from "../../util/FieldData";

import {Stack, Layer} from '@carbon/react';

import {Add, Close} from '@carbon/icons-react';
import { Dod, Pld, Organization, User, DodCreateBody, OrganizationSection } from "@pld/shared";
import {DodApiController} from "../../controller/DodApiController";
import {UserContextProps} from "../../context/UserContext";
import {RequiredLabel} from "../../util/Label";
import {validate} from "class-validator";
import {ReactFormValidation} from "../../util/Page";
import { OrganizationApiController } from "../../controller/OrganizationApiController";
import { toast } from "react-toastify";

export type UserWorkTime = {
  users: string[] | User[];
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
  version: FieldData<string>;
  title: FieldData<string>;
  skinOf: FieldData<string>;
  want: FieldData<string>;
  description: FieldData<string>;
  descriptionOfDone: FieldData<string[]>;
  estimatedWorkOfTime: FieldData<UserWorkTime[]>
  orgSection: OrganizationSection[];
}

export class NewDodModal extends ReactFormValidation<NewDodModalProps, NewDodModalState> {

  constructor(props) {
    super(props);
    this.state = {
      orgSection: [],
      preview: false,
      version: {
        value: ''
      },
      description: {
        value: ''
      },
      descriptionOfDone: {
        value: ['']
      },
      estimatedWorkOfTime: {
        value: [{
          value: 0,
          users: [],
          format: EstimatedWorkTimeFormat.JOUR_HOMME,
        }]
      },
      skinOf: {
        value: ''
      },
      title: {
        value: ''
      },
      want: {
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
    this.onClickEnterDoD = this.onClickEnterDoD.bind(this);
  }

  private onModalOpen() {
    if (this.props.lastDod.length > 0) {
      this.props.lastDod.sort((dodA, dodB) => dodB.created_date.getDate() - dodA.created_date.getDate());
    }
    this.state.estimatedWorkOfTime.value.push({
      format: EstimatedWorkTimeFormat.JOUR_HOMME,
      users: [(this.props.org.owner as User)._id],
      value: 0
    });
    this.setState({
      estimatedWorkOfTime: this.state.estimatedWorkOfTime
    });
    this.prefillField();
    OrganizationApiController.getOrgSections(this.props.authContext.accessToken, this.props.org._id, (section, error) => {
      if (error) {
        toast('Une erreur est survenue lors de la recuperation des sections !', {type: 'error'})
      } else {
        this.setState({orgSection: section});
      }
    })
  }

  private clearField() {
    this.setState({
      preview: false,
      version: {
        value: ''
      },
      description: {
        value: ''
      },
      descriptionOfDone: {
        value: ['']
      },
      estimatedWorkOfTime: {
        value: [{
          value: 0,
          users: [],
          format: EstimatedWorkTimeFormat.JOUR_HOMME
        }]
      },
      skinOf: {
        value: ''
      },
      title: {
        value: ''
      },
      want: {
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
      title: {
        value: this.props.editionDod.title,
      },
      version: {
        value: this.props.editionDod.version,
      },
      description: {
        value: this.props.editionDod.description,
      },
      want: {
        value: this.props.editionDod.want,
      },
      skinOf: {
        value: this.props.editionDod.skinOf
      },
      descriptionOfDone: {
        value: this.props.editionDod.descriptionOfDone,
      },
      estimatedWorkOfTime: {
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

  override componentDidUpdate(prevProps: Readonly<NewDodModalProps>, prevState: Readonly<NewDodModalState>, snapshot?: unknown) {
    if (this.props.open && !prevProps.open) {
      this.onModalOpen();
    }
  }

  private onClickCreate() {
    //TODO check each field
    const body: DodCreateBody = new DodCreateBody(this.state.version.value, this.state.title.value, this.state.skinOf.value, this.state.want.value,
      this.state.description.value,
      this.props.pld._id,
      this.props.authContext.user?._id ?? '',
      this.state.descriptionOfDone.value,
      (this.state.estimatedWorkOfTime.value as any)
    );
    validate(body).then((errors) => {
      if (errors.length <= 0)
        return true;
      errors.forEach((error) => {
        const msg = Object.entries(error.constraints ?? {}).map((a) => a[1]);
        if (error.property === 'estimatedWorkTime') {
          this.updateFormField(error.property, [{value: 0, users: [''], format: EstimatedWorkTimeFormat.JOUR_HOMME}], msg.join(', '));
        } else if (error.property === 'descriptionOfDone') {
          this.updateFormField(error.property, [''], msg.join(', '));
        } else {
          this.updateFormField(error.property, '', msg.join(', '));
        }
      })
      return false;
    }).then((valid) => {
      if (!valid)
        return;
      if (this.props.editionDod !== undefined) {
        DodApiController.updateDod(this.props.authContext.accessToken, this.props.org._id, this.props.pld._id, this.props.editionDod._id, body, (dod, error) => {
          if (!error && dod !== null) {
            this.props.onCreatedDod(dod);
          }
          if (dod === null) {
            console.error(error);
          }
        });
      } else {
        DodApiController.createDod(this.props.authContext.accessToken, this.props.org._id, this.props.pld._id, body, (dod, error) => {
          if (!error && dod !== null) {
            this.props.onCreatedDod(dod);
          }
          if (dod === null) {
            console.error(error);
          }
        });
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
    const values: string[] = this.state.descriptionOfDone.value;
    values.push('');
    this.setState({
      descriptionOfDone: {
        value: values
      }
    })
  }

  private onClickAddEstimatedWorkTime() {
    const values: UserWorkTime[] = this.state.estimatedWorkOfTime.value;
    values.push({
      format: EstimatedWorkTimeFormat.JOUR_HOMME,
      users: [(this.props.org.owner as User)._id],
      value: 0
    });
    this.setState({
      estimatedWorkOfTime: {
        value: values
      }
    })
  }

  private onClickDeleteDefinitionOfDone(index: number) {
    const values: string[] = this.state.descriptionOfDone.value;
    values.splice(index, 1);
    this.setState({
      descriptionOfDone: {
        value: values,
      }
    })
  }

  private onClickDeleteEstimatedWorkTime(index: number) {
    const values: UserWorkTime[] = this.state.estimatedWorkOfTime.value;
    values.splice(index, 1);
    this.setState({
      estimatedWorkOfTime: {
        value: values,
      }
    })
  }

  private onClickEnterDoD(event, index) {
    if (event.key === 'Enter')
      this.onClickAddDefinitionOfDone();
  }

  private showDefinitionsOfDoneText() {
    return this.state.descriptionOfDone.value.map((dod, index) => {
      return (
        <Grid key={index} style={{marginTop: '0px'}}>
          <Column lg={10} md={7}>
            <TextInput
              onKeyPress={(event) => {this.onClickEnterDoD(event, index)}}
              invalid={this.state.descriptionOfDone.error !== undefined}
              invalidText={this.state.descriptionOfDone.error}
              required id={"dod-"} labelText={""} hideLabel={true} value={dod} onChange={(e) => {
              const value = this.state.descriptionOfDone.value;
              value[index] = e.currentTarget.value;
              this.setState({
                descriptionOfDone: {
                  value: value,
                }
              })
            }}/>
          </Column>
          <Column lg={2} style={{marginTop: 'auto', marginBottom: 'auto'}}>
            <Stack gap={2} orientation={"horizontal"}>
              <Button iconDescription={'X'} kind={"tertiary"} hasIconOnly renderIcon={Close} onClick={() => this.onClickDeleteDefinitionOfDone(index)} size={"sm"}/>
            </Stack>
          </Column>
        </Grid>
      )
    })
  }

  private showEstimatedWorkTime() {
    return this.state.estimatedWorkOfTime.value.map((dod, index) => {
      return (
        <Grid key={index} style={{marginBottom: '10px', alignItems: 'center'}}>
          <Column lg={6} md={3}>
            <FilterableMultiSelect
              invalid={this.state.estimatedWorkOfTime.error !== undefined}
              invalidText={this.state.estimatedWorkOfTime.error}
              items={(this.props.org.members as User[]).concat([this.props.org.owner as User]).map((user) => ({label: user.email, value: user._id}))}
              placeholder={"Email de l'utilisateur..."}
              id="dod-estimated-work-time-user"
              selectedItems={dod.users.map((user) => {return {label: user, value: user}})}
              onChange={(e) => {
                const value = this.state.estimatedWorkOfTime.value;
                value[index].users = e.selectedItems.map((item) => (item.value));
                this.setState({
                  estimatedWorkOfTime: {
                    value: value
                  }
                })
              }}
              selectionFeedback="top-after-reopen"/>
          </Column>
          <Column lg={5} md={2}>
            <NumberInput id={"dod-estimated-work-time-time"} iconDescription={""} value={this.state.estimatedWorkOfTime.value[index].value} onChange={(e) => {
              const value = this.state.estimatedWorkOfTime.value;
              value[index].value = e.imaginaryTarget.value;
              this.setState({
                estimatedWorkOfTime: {
                  value: value
                }
              })
            }}/>
          </Column>
          <Column lg={1} md={1}>
            <Button iconDescription={"X"} kind={"tertiary"} hasIconOnly renderIcon={Close} onClick={() => this.onClickDeleteEstimatedWorkTime(index)} size={"sm"}/>
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

  private onClickEnter(event, next) {
    if (event.key === 'Enter') {
      event.currentTarget.form.elements[next].focus();
    }
  }

  private getVersionSelection() {
    const abc = this.state.orgSection.map((section) => {
      return {
        name: `${section.section} - ${section.name}`,
        version: section.section
      }
    }).sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      return -1;
    });
    console.log(abc);
    return abc;
  }

  private showInputSelect() {
    if (this.state.version.value === '') {
      return (
        <ComboBox id={'select-version'}
                  placeholder={'1.1.0 ...'}
                  titleText={<RequiredLabel message={"Version"}/>}
                  value={this.state.version.value}
                  onChange={(a) => this.setState({version: {value: a.selectedItem?.version ?? ''}})}
                  items={this.getVersionSelection()}
                  itemToString={(item) => (item ? item.name : '')}
        />);
    } else {
      return (
        <TextInput id={'input-version'} labelText={<RequiredLabel message={"Version"}/>} value={this.state.version.value} onChange={(e) => this.setState({
          version: {
            value: e.currentTarget.value
          }
        })}/>
      )
    }
  }

  private showEdit() {
    if (this.state.preview)
      return;
    return (
      <form>
        <Stack gap={3}>
          <Grid>
            <Column lg={3} md={3}>
              <Layer>
                {this.showInputSelect()}
              </Layer>
              {/*<TextInput
                onKeyPress={(event) => this.onClickEnter(event, 1)}
                invalid={this.state.version.error !== undefined}
                invalidText={this.state.version.error}
                id={"dod-version"} labelText={<RequiredLabel message={"Version"}/>} min={0} value={this.state.version.value} onChange={(e) => {
                this.setState({
                  version: {
                    value: e.currentTarget.value,
                  }
                })
              }}/>*/}
            </Column>
            <Column lg={8} md={5}>
              <TextInput
                placeholder={'Mettre en place le vps....'}
                onKeyPress={(event) => this.onClickEnter(event, 2)}
                invalid={this.state.title.error !== undefined}
                invalidText={this.state.title.error}
                id={"dod-title"} labelText={<RequiredLabel message={"Nom du DoD"}/>} value={this.state.title.value} onChange={(e) => {
                this.setState({
                  title: {
                    value: e.currentTarget.value
                  }
                })
              }}/>
            </Column>
          </Grid>
          <Grid>
            <Column lg={3} md={3}>
              <TextInput
                placeholder={'Développeur'}
                onKeyPress={(event) => this.onClickEnter(event, 3)}
                invalid={this.state.skinOf.error !== undefined}
                invalidText={this.state.skinOf.error}
                id={"dod-skinOf"} labelText={<RequiredLabel message={"En tant que ..."}/>} value={this.state.skinOf.value} onChange={(e) => {
                this.setState({
                  skinOf: {
                    value: e.currentTarget.value,
                  }
                })
              }}/>
            </Column>
            <Column lg={8} md={5}>
              <TextInput
                placeholder={'Pouvoir créer une bouton sur le vps'}
                onKeyPress={(event) => this.onClickEnter(event, 4)}
                invalid={this.state.want.error !== undefined}
                invalidText={this.state.want.error}
                id={"dod-want"} labelText={<RequiredLabel message={"Je veux ..."}/>} value={this.state.want.value} onChange={(e) => {
                this.setState({
                  want: {
                    value: e.currentTarget.value
                  }
                })
              }}/>
            </Column>
          </Grid>
          <TextArea
            placeholder={'En cliquant sur le bouton "X" je souhaite configurer le vps'}
            onKeyPress={(event) => this.onClickEnter(event, 5)}
            invalid={this.state.description.error !== undefined}
            invalidText={this.state.description.error}
            id={"dod-description"} labelText={<RequiredLabel message={"Description"}/>} value={this.state.description.value} onChange={(e) => {
              this.setState({
                description: {
                  value: e.currentTarget.value
                }
              });
          }}/>
          <>
            <RequiredLabel message={"Définition of Done"}/>
            {this.showDefinitionsOfDoneText()}
            <Button size={"sm"} iconDescription={"Ajouter une définition"} kind={"secondary"}  onClick={this.onClickAddDefinitionOfDone} hasIconOnly renderIcon={Add}/>
          </>
          <div>
            <RequiredLabel message={"Temps estimé"}/>
            {this.showEstimatedWorkTime()}
            <Button size={"sm"} iconDescription={"Ajouter une définition"} kind={"secondary"}  onClick={this.onClickAddEstimatedWorkTime} hasIconOnly renderIcon={Add}/>
          </div>
        </Stack>
        <Button style={{marginTop: 28}} onClick={this.onClickCreate} renderIcon={Add}>Créer</Button>
      </form>
    )
  }

  override render() {
    return (
      <Modal
        size={"md"}
        open={this.props.open}
        passiveModal
        secondaryButtonText={"Fermer"}
        onRequestClose={this.props.onDismiss}
        modalHeading={this.props.editionDod !== undefined ? 'Modification du dod' : "Créer un nouveau DoD"}>
        {this.showPreview()}
        {this.showEdit()}
      </Modal>
    );
  }

}
