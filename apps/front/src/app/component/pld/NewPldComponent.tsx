import React from "react";
import {RequiredUserContextProps} from "../../context/UserContext";
import {
  Button, Column,
  DatePicker,
  DatePickerInput, Grid,
  NumberInput,
  Select,
  SelectItem,
  TextArea,
  TextInput,
  Tile
} from "carbon-components-react";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import {Organization, User, PldOrgCreateBody, Pld} from "@pld/shared";
import {FieldData, onEnter} from "../../util/FieldData";

import {Stack, Tag} from '@carbon/react';

import {Close, ArrowUp, ArrowDown, TrashCan, Add} from '@carbon/icons-react';
import {PldApiController} from "../../controller/PldApiController";
import {HelperText} from "../../util/HelperText";
import {RequiredLabel} from "../../util/Label";

export type NewPldComponentProps = {
  orgId?: string;
  onPldCreated: (pld: Pld) => void;
} & RequiredUserContextProps;

export type NewPldComponentState = {
  org?: Organization;
  loading: boolean;
  form: NewPldForm;
}

export type NewPldForm = {
  name: FieldData<string>;
  sprintDates: FieldData<Date[]>;
  description: FieldData<string>;
  manager: FieldData<string>;
  tags: FieldData<string[]>;
  tagsInput: FieldData<string>;
  promotion: FieldData<number>;
  version: FieldData<number>;
  steps: FieldData<string[]>;
}

export class NewPldComponent extends React.Component<NewPldComponentProps, NewPldComponentState> {

  constructor(props) {
    super(props);
    this.state = {
      org: undefined,
      loading: true,
      form: {
        name: {
          value: ''
        },
        description: {
          value: '',
        },
        manager: {
          value: '',
        },
        tags: {
          value: [],
        },
        tagsInput: {
          value: '',
        },
        promotion: {
          value: new Date().getFullYear(),
        },
        version: {
          value: 0
        },
        sprintDates: {
          value: [],
        },
        steps: {
          value: ['Kick-Off', 'Follow-Up', 'Delivery']
        },
      }
    }
    this.onClickCreate = this.onClickCreate.bind(this);
    this.updateField = this.updateField.bind(this);
    this.addStatus = this.addStatus.bind(this);
    this.deleteStatus = this.deleteStatus.bind(this);
    this.upStatus = this.upStatus.bind(this);
    this.downStatus = this.downStatus.bind(this);
  }

  override componentDidMount() {
    if (this.props.orgId !== undefined) {
      OrganizationApiController.findOrganizationById(this.props.userContext.accessToken, this.props.orgId, (org, error) => {
        if (error !== undefined || org === null)
          return;
        else
          this.setState({
            org: org,
            loading: false,
          })
      });
    }
  }

  private updateField<T>(fieldKey: string, value: T) {
    this.setState({
      form: {
        ...this.state.form,
        [fieldKey]: {
          value: value
        },
      }
    })
  }

  private showTag() {
    const tagsComponent: JSX.Element[] | undefined = this.state.form.tags?.value?.map((tag, index) => {
      return (
        <Tag key={index}
             renderIcon={Close}
             type={"blue"}
             onClick={() => {
               this.state.form.tags?.value?.splice(index, 1);
               this.updateField('tags', this.state.form.tags?.value);
             }}
             size="lg">
          {tag}
        </Tag>
      )
    })
    return (
      <Tile style={{padding: '20px', margin: '20px 0px'}}>
        {tagsComponent}
        <TextInput id={"pld-tag-input"} labelText={"Entrer les tags de votre PLD"} onKeyDown={(e) => onEnter(e, () => {
          this.state.form.tags?.value?.push(e.currentTarget.value);
          e.currentTarget.value = '';
          this.updateField('tags', this.state.form.tags?.value);
        })}/>
      </Tile>
    )
  }

  private onClickCreate() {
    if (this.props.orgId === undefined)
      return;

    if (this.state.form.manager.value === '' && this.state.org?.owner !== undefined)
      this.state.form.manager.value = (this.state.org?.owner as User)._id;
    const body: PldOrgCreateBody = {
      tags: this.state.form.tags.value,
      title: this.state.form.name.value,
      version: this.state.form.version.value,
      description: this.state.form.description.value,
      manager: this.state.form.manager.value,
      owner: this.props.orgId,
      promotion: this.state.form.promotion.value,

      endingDate: this.state.form.sprintDates.value[0],
      startingDate: this.state.form.sprintDates.value[1],
      steps: this.state.form.steps.value,
    }

    PldApiController.createOrgPld(this.props.userContext.accessToken, this.props.orgId, body, (pld, error) => {
      if (error) {
        console.log(error);
      } else if (pld !== null){
        this.props.onPldCreated(pld);
      }
    });

  }

  private showManagerSelect() {
    if (this.state.org?.members === undefined || this.state.org?.owner === undefined)
      return;
    const owner = this.state.org.owner as User;
    return (
      <>
        <RequiredLabel message={"Manager"}/>
        <Select
          id="new-pld-manager"
          onChange={(e) => {this.updateField('manager', e.currentTarget.value)}}
          labelText={false}
          invalidText={this.state.form.manager?.error}
          invalid={this.state.form.manager?.error !== undefined}>
          <SelectItem text={owner.email} value={owner._id} />
          {(this.state.org.members as User[]).map((user, index) => {
            return (<SelectItem key={index} value={user._id} text={user.email}/>)
          })}
        </Select>
      </>
    )
  }

  private showSteps() {
    return <>
      {this.state.form.steps.value.map((step, index) => {
        return (
          <Grid key={index} style={{paddingRight: 10, paddingLeft: 10}}>
            <Column lg={11}>
              <TextInput id={"step"} labelText={false} value={step} onChange={(e) => {
                this.state.form.steps.value[index] = e.currentTarget.value;
                this.setState({});
              }}/>
            </Column>
            <Column lg={4}>
              <Button hasIconOnly iconDescription={"Faire monter"} renderIcon={ArrowUp} kind={"ghost"} disabled={index === 0} onClick={() => this.downStatus(index)}/>
              <Button hasIconOnly iconDescription={"Faire descendre"} renderIcon={ArrowDown} kind={"ghost"} disabled={index === this.state.form.steps.value.length-1} onClick={() => this.upStatus(index)}/>
              <Button hasIconOnly iconDescription={"Supprimer"} renderIcon={TrashCan} kind={"ghost"} onClick={() => this.deleteStatus(index)}/>
            </Column>
          </Grid>
        )
      })}
      <Button style={{marginRight: 10, marginLeft: 10}} hasIconOnly renderIcon={Add} iconDescription={"Ajouter un status"} onClick={this.addStatus}/>
    </>
  }

  private upStatus(index: number) {
    const status = this.state.form.steps.value[index];
    this.state.form.steps.value.splice(index, 1);
    this.state.form.steps.value.splice(index+1, 0, status);
    this.setState({});
  }

  private downStatus(index: number) {
    const status = this.state.form.steps.value[index];
    this.state.form.steps.value.splice(index, 1);
    this.state.form.steps.value.splice(index-1, 0, status);
    this.setState({});
  }

  private deleteStatus(index: number) {
    this.state.form.steps.value.splice(index, 1);
    this.setState({});
  }

  private addStatus() {
    this.state.form.steps.value.push('Nouveau Status')
    this.setState({});
  }

  override render() {
    return (
      <Stack gap={4}>
        <h1>Création d'un nouveau PLD</h1>
        <h4>Informations de base</h4>
        <RequiredLabel message={"Nom"}/>
        <TextInput id={"pld-name"} labelText={false}
                   required
                   onChange={(e) => this.updateField('name', e.currentTarget.value)}
                   invalid={this.state.form.name?.error !== undefined}
                   invalidText={this.state.form.name?.error}
        />
        <RequiredLabel message={"Description"}/>
        <TextArea rows={4} id={"pld-description"} labelText={false}
                  required
                  invalid={this.state.form.description?.error !== undefined}
                  invalidText={this.state.form.description?.error}
                  onChange={(e) => this.updateField('description', e.currentTarget.value)}/>
        {this.showManagerSelect()}
        {this.showTag()}
        <RequiredLabel message={"Promotion"}/>
        <NumberInput id={"pld-promotion"}
                     required
                     iconDescription={"Promotion"}
                     onChange={(e) => {
                       if (e.imaginaryTarget.value === '')
                         return;
                       this.updateField('promotion', parseInt(e.imaginaryTarget.value));}}
                     value={this.state.form.promotion?.value ?? 0}/>
        <RequiredLabel message={"Version de début"}/>
        <NumberInput id={"pld-version"}
                     required
                     iconDescription={"Version"}
                     value={this.state.form.version?.value ?? 0}
                     min={0}
                     onChange={(e) => {
                       if (e.imaginaryTarget.value === '')
                         return;
                       this.updateField('version', parseFloat(e.imaginaryTarget.value));}}/>
        <h4>Info du Sprint</h4>
        <DatePicker locale={"fr"} datePickerType="range" onChange={(dates) => {
          if (dates.length < 2)
            return;
          this.updateField('sprintDates', dates);
        }}>
          <DatePickerInput
            id="date-picker-input-id-start"
            placeholder="mm/dd/yyyy"
            labelText="Début du sprint"
          />
          <DatePickerInput
            id="date-picker-input-id-finish"
            placeholder="mm/dd/yyyy"
            labelText="Fin du sprint"
          />
        </DatePicker>
        <HelperText type={'help'} title={<h4>Status possible du PLD</h4>}
                    helpMessage={<>
                      <p>"Le Pld peut avoir plusieurs états lors de sa conception (ex: Kick-Off, Follow-up...)"</p>
                      <p>Veuillez noté que l'ordre des status est important !</p>
                      </>} logoSize={14}/>
        {this.showSteps()}
        <Button onClick={this.onClickCreate} renderIcon={Add} iconDescription={"Create"}>Créer</Button>
      </Stack>
    );
  }
}
