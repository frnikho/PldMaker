import React from "react";
import {RequiredUserContextProps} from "../../../context/UserContext";
import {Button, NumberInput, Select, SelectItem, Tag, TextArea, TextInput, Tile} from "carbon-components-react";
import {OrganizationApiController} from "../../../controller/OrganizationApiController";
import {Organization} from "../../../../../../../libs/data-access/organization/Organization";
import {FieldData, onEnter} from "../../../util/FieldData";
import {User} from "../../../../../../../libs/data-access/user/User";

import {Close} from '@carbon/icons-react';
import {PldApiController} from "../../../controller/PldApiController";
import {PldOrgCreateBody} from "../../../../../../../libs/data-access/pld/PldBody";
import {Pld} from "../../../../../../../libs/data-access/pld/Pld";

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
  description: FieldData<string>;
  manager: FieldData<string>;
  tags: FieldData<string[]>;
  tagsInput: FieldData<string>;
  promotion: FieldData<number>;
  version: FieldData<number>;
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
        }
      }
    }
    this.onClickCreate = this.onClickCreate.bind(this);
    this.updateField = this.updateField.bind(this);
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
        <Tag key={index} className="some-class"
             renderIcon={Close}
             onClick={() => {
               this.state.form.tags?.value?.splice(index, 1);
               this.updateField('tags', this.state.form.tags?.value);
             }}
             size="md">
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

    console.log(this.state.form.name.value);

    const body: PldOrgCreateBody = {
      tags: this.state.form.tags.value,
      title: this.state.form.name.value,
      version: this.state.form.version.value,
      description: this.state.form.description.value,
      manager: this.state.form.manager.value,
      owner: this.props.orgId,
      promotion: this.state.form.promotion.value
    }
    console.log(body);
    PldApiController.createOrgPld(this.props.userContext.accessToken, body, (pld, error) => {
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
      <Select
        id="new-pld-manager"
        onChange={(e) => {this.updateField('manager', e.currentTarget.value)}}
        labelText="Manager"
        invalidText={this.state.form.manager?.error}
        invalid={this.state.form.manager?.error !== undefined}>
        <SelectItem text={owner.email} value={owner._id} />
        {(this.state.org.members as User[]).map((user, index) => {
          return (<SelectItem key={index} value={user._id} text={user.email}/>)
        })}
      </Select>
    )
  }

  override render() {
    return (
      <>
        <h1>Création d'un nouveau PLD</h1>
        <TextInput id={"pld-name"} labelText={"Nom du pld"}
                   required
                   onChange={(e) => this.updateField('name', e.currentTarget.value)}
                   invalid={this.state.form.name?.error !== undefined}
                   invalidText={this.state.form.name?.error}
        />
        <TextArea rows={4} id={"pld-description"} labelText={"Description du pld"}
                  required
                   invalid={this.state.form.description?.error !== undefined}
                   invalidText={this.state.form.description?.error}
                   onChange={(e) => this.updateField('description', e.currentTarget.value)}/>
        {this.showManagerSelect()}
        {this.showTag()}
        <NumberInput id={"pld-promotion"}
                     required
                     iconDescription={"Promotion"}
                     label={"Promotion"}
                     onChange={(e) => {
                       if (e.imaginaryTarget.value === '')
                         return;
                       this.updateField('promotion', parseInt(e.imaginaryTarget.value));}}
                     value={this.state.form.promotion?.value ?? 0}/>
        <NumberInput id={"pld-version"}
                     required
                     iconDescription={"Version"}
                     label={"Version du pld"}
                     value={this.state.form.version?.value ?? 0}
                     min={0}
                     onChange={(e) => {
                       if (e.imaginaryTarget.value === '')
                         return;
                       this.updateField('version', parseFloat(e.imaginaryTarget.value));}}/>
        <Button onClick={this.onClickCreate}>Créer</Button>
      </>
    );
  }
}
