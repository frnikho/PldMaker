import React, { useContext, useEffect, useState } from "react";
import { RequiredUserContextProps, UserContext, UserContextProps } from "../../context/UserContext";
import {
  Breadcrumb, BreadcrumbItem,
  Button, Column,
  DatePicker,
  DatePickerInput, FormLabel, Grid,
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

import {Stack} from '@carbon/react';

import {Close, ArrowUp, ArrowDown, TrashCan, Add} from '@carbon/icons-react';
import {HelperText} from "../../util/HelperText";
import {RequiredLabel} from "../../util/Label";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { validate } from "class-validator";
import { PldApiController } from "../../controller/PldApiController";
import { cleanup } from "@testing-library/react";

export type NewPldComponentProps = {
  orgId?: string;
  onPldCreated: (pld: Pld) => void;
} & RequiredUserContextProps;

export type NewPldComponentState = {
  org?: Organization;
  loading: boolean;
  form: NewPldForm;
  redirectUrl?: string;
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

/*export class NewPldComponent extends React.Component<NewPldComponentProps, NewPldComponentState> {

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
          value: 1.0
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
        <Button key={index}
                style={{margin: 2, borderRadius: 16}}
                renderIcon={Close}
                onClick={() => {
                   this.state.form.tags?.value?.splice(index, 1);
                   this.updateField('tags', this.state.form.tags?.value);
                }}
             size="sm">
          {tag}
        </Button>
      )
    })
    return (
      <Tile style={{padding: '20px', margin: '20px 0px'}}>
        {tagsComponent}
        <TextInput id={"pld-tag-input"} helperText={"Les tags sont utilisés pour la génération des documents word"} labelText={"Entrer les tags de votre PLD"} onKeyDown={(e) => onEnter(e, () => {
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
        <Select
          id="new-pld-manager"
          onChange={(e) => {this.updateField('manager', e.currentTarget.value)}}
          labelText={<RequiredLabel message={"Manager"}/>}
          helperText={"le manager peut être changer plus tard"}
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
              <TextInput id={"step_" + index} labelText={false} value={step} onChange={(e) => {
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
      <>
        {this.state.redirectUrl ? <Navigate to={this.state.redirectUrl}/> : null}
        <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
          <BreadcrumbItem onClick={() => this.setState({redirectUrl: '/'})}>Dashboard</BreadcrumbItem>
          <BreadcrumbItem onClick={() => this.setState({redirectUrl: `/organization/${this.props.orgId}`})}>Organisation</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>Pld</BreadcrumbItem>
        </Breadcrumb>
        <Stack gap={4}>
          <h1 style={{fontWeight: 'bold'}}>Création d'un nouveau PLD</h1>
          <TextInput id={"pld-name"} labelText={<RequiredLabel message={"Nom"}/>}
                     helperText={"le nom doit contenir au minimum 5 caractères et au maximum 64"}
                     onChange={(e) => this.updateField('name', e.currentTarget.value)}
                     invalid={this.state.form.name?.error !== undefined}
                     invalidText={this.state.form.name?.error}
          />
          <TextArea rows={4} id={"pld-description"}
                    labelText={<RequiredLabel message={"Description"}/>}
                    helperText={"la description doit contenir au minimum 1 caractères et au maximum 512"}
                    required
                    invalid={this.state.form.description?.error !== undefined}
                    invalidText={this.state.form.description?.error}
                    onChange={(e) => this.updateField('description', e.currentTarget.value)}/>
          {this.showManagerSelect()}
          {this.showTag()}
          <RequiredLabel message={"Promotion"}/>
          <NumberInput id={"pld-promotion"}
                       min={1900}
                       max={2900}
                       required
                       iconDescription={"Promotion"}
                       onChange={(e) => {
                         if (e.imaginaryTarget.value === '')
                           return;
                         this.updateField('promotion', parseInt(e.imaginaryTarget.value));}}
                       value={this.state.form.promotion?.value ?? 0}/>
          <NumberInput id={"pld-version"}
                       required
                       label={<RequiredLabel message={"Version de début"}/>}
                       iconDescription={"Version"}
                       value={this.state.form.version?.value ?? 1.0}
                       min={0}
                       step={this.state.org?.versionShifting ?? 0.1}
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
              labelText={<RequiredLabel message={"Début du sprint"}/>}
            />
            <DatePickerInput
              id="date-picker-input-id-finish"
              placeholder="mm/dd/yyyy"
              labelText={<RequiredLabel message={"Fin du sprint"}/>}
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
      </>
    );
  }
}*/

type Props = {
  orgId: string;
  onPldCreated: (pld: Pld) => void;
};

type PldForm = {
  title: string;

  startingDate: Date;
  endingDate: Date;

  description: string;
  manager: string;
  tags: string[];
  tagsInput: string;
  promotion: number;
  version: number;
  steps: string[];
}

export const NewPldComponent = (props: Props) => {

  const {watch, getValues, setError, setValue, formState: {errors}, clearErrors} = useForm<PldForm>({defaultValues: {
      promotion: new Date().getFullYear(),
      version: 1.0,
      manager: '',
      description: '',
      steps: [],
      tags: [],
    }});
  const [org, setOrg] = useState<undefined | Organization>(undefined);
  const userCtx = useContext<UserContextProps>(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    OrganizationApiController.findOrganizationById(userCtx.accessToken, props.orgId, (org, error) => {
      if (error !== undefined || org === null) {
        return;
      } else {
        setOrg(org);
      }
    });
  }, []);

  const upStatus = (index: number) => {
    const steps = getValues('steps');
    const status = steps[index];
    steps.splice(index, 1);
    steps.splice(index+1, 0, status);
    setValue('steps', steps);
  }

  const downStatus = (index: number) => {
    const steps = getValues('steps');
    const status = steps[index];
    steps.splice(index, 1);
    steps.splice(index-1, 0, status);
    setValue('steps', steps);
  }

  const deleteStatus = (index: number) => {
    const steps = getValues('steps');
    steps.splice(index, 1);
    setValue('steps', steps);
  }

  const addStatus = () => {
    const steps = getValues('steps');
    steps.push('Nouveau Status');
    setValue('steps', steps);
  }

  const onClickCreate = () => {
    let managerId = '';
    const form = getValues();
    if (getValues('manager') === '' && org?.owner !== undefined)
      managerId = org?.owner._id;
    clearErrors();
    const body = new PldOrgCreateBody(form.title, form.description, props.orgId, managerId, form.tags, form.promotion, form.version, form.startingDate, form.endingDate, form.steps);
    validate(body).then((errors) => {
      console.log(errors);
      errors.forEach((err) => {
        const msg = Object.entries(err.constraints ?? {}).map((a) => a[1]);
        setError(err.property as keyof PldForm, {message: msg.join(', ')});
      })
      if (errors.length > 0)
        return;
      PldApiController.createOrgPld(userCtx.accessToken, props.orgId, body, (pld, error) => {
        if (error) {
          console.log(error);
        } else if (pld !== null){
          props.onPldCreated(pld);
        }
      });
    })
  }

  const showTag = () => {
    const tagsComponent: JSX.Element[] | undefined = watch('tags')?.map((tag, index) => {
      return (
        <Button key={index}
                style={{margin: 2, borderRadius: 16}}
                renderIcon={Close}
                onClick={() => {
                  const array = getValues('tags');
                  array.splice(index, 1)
                  setValue('tags', array);
                }}
                size="sm">
          {tag}
        </Button>
      )
    })
    return (
      <Tile style={{padding: '20px', margin: '20px 0px'}}>
        {tagsComponent}
        <TextInput
          invalid={errors.tags?.message !== undefined}
          invalidText={errors.tags?.message}
          id={"pld-tag-input"} helperText={"Les tags sont utilisés pour la génération des documents word"} labelText={"Entrer les tags de votre PLD"} onKeyDown={(e) => onEnter(e, () => {
          const array = getValues('tags') ?? [];
          array.push(e.currentTarget.value);
          e.currentTarget.value = '';
          setValue('tags', array);
        })}/>
      </Tile>
    )
  }

  const showManagerSelect = () => {
    if (org?.members === undefined || org?.owner === undefined)
      return;
    const owner = org.owner as User;
    return (
      <Select
        id="new-pld-manager"
        onChange={(e) => {setValue('manager', e.currentTarget.value)}}
        labelText={<RequiredLabel message={"Manager"}/>}
        helperText={"le manager est utilisé dans la génération du document word"}
        invalidText={errors.manager?.message}
        invalid={errors.manager?.message !== undefined}>
        <SelectItem text={owner.email} value={owner._id} />
        {(org.members as User[]).map((user, index) => {
          return (<SelectItem key={index} value={user._id} text={user.email}/>)
        })}
      </Select>
    )
  }

  const showSteps = () => {
    return <>
      {watch('steps').map((step, index) => {
        return (
          <Grid key={index} style={{paddingRight: 10, paddingLeft: 10}}>
            <Column lg={11}>
              <TextInput id={"step_" + index} labelText={false} value={step} onChange={(e) => {
                const array = getValues('steps');
                array[index] = e.currentTarget.value;
                setValue('steps', array);
              }}/>
            </Column>
            <Column lg={4}>
              <Button hasIconOnly iconDescription={"Faire monter"} renderIcon={ArrowUp} kind={"ghost"} disabled={index === 0} onClick={() => downStatus(index)}/>
              <Button hasIconOnly iconDescription={"Faire descendre"} renderIcon={ArrowDown} kind={"ghost"} disabled={index === getValues('steps').length-1} onClick={() => upStatus(index)}/>
              <Button hasIconOnly iconDescription={"Supprimer"} renderIcon={TrashCan} kind={"ghost"} onClick={() => deleteStatus(index)}/>
            </Column>
          </Grid>
        )
      })}
      <Button style={{marginRight: 10, marginLeft: 10}} hasIconOnly renderIcon={Add} iconDescription={"Ajouter un status"} onClick={addStatus}/>
    </>
  }

  return (
    <>
      <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
        <BreadcrumbItem onClick={() => navigate('/')}>Dashboard</BreadcrumbItem>
        <BreadcrumbItem onClick={() => navigate(`/organization/${props.orgId}`)}>Organisation</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Pld</BreadcrumbItem>
      </Breadcrumb>
      <Stack gap={4}>
        <h1 style={{fontWeight: 'bold'}}>Création d'un nouveau PLD</h1>
        <TextInput id={"pld-name"} labelText={<RequiredLabel message={"Nom"}/>}
                   helperText={"le nom doit contenir au minimum 5 caractères et au maximum 64"}
                   onChange={(e) => setValue('title', e.currentTarget.value)}
                   invalid={errors.title?.message !== undefined}
                   invalidText={errors.title?.message}
        />
        <TextArea rows={4} id={"pld-description"}
                  labelText={<RequiredLabel message={"Description"}/>}
                  helperText={"la description doit contenir au minimum 1 caractères et au maximum 512"}
                  required
                  invalid={errors?.description?.message !== undefined}
                  invalidText={errors?.description?.message}
                  onChange={(e) => setValue('description', e.currentTarget.value)}/>
        {showManagerSelect()}
        {showTag()}
        <RequiredLabel message={"Promotion"}/>
        <NumberInput id={"pld-promotion"}
                     min={1900}
                     max={2900}
                     required
                     iconDescription={"Promotion"}
                     onChange={(e) => {
                       if (e.imaginaryTarget.value === '')
                         return;
                       setValue('promotion', parseInt(e.imaginaryTarget.value));}}
                     value={watch('promotion')}/>
        <NumberInput id={"pld-version"}
                     required
                     label={<RequiredLabel message={"Version de début"}/>}
                     iconDescription={"Version"}
                     value={watch('version')}
                     min={0}
                     step={org?.versionShifting ?? 0.1}
                     onChange={(e) => {
                       if (e.imaginaryTarget.value === '')
                         return;
                       setValue('version', parseFloat(e.imaginaryTarget.value));}}/>
        <h4>Info du Sprint</h4>
        <DatePicker locale={"fr"} datePickerType="range" onChange={(dates) => {
          if (dates.length < 2)
            return;
          setValue('startingDate', dates[0]);
          setValue('endingDate', dates[1]);
        }}>
          <DatePickerInput
            size={'lg'}
            invalid={errors.startingDate?.message !== undefined}
            id="date-picker-input-id-start"
            placeholder="mm/dd/yyyy"
            labelText={<RequiredLabel message={"Début du sprint"}/>}
          />
          <DatePickerInput
            size={'lg'}
            invalid={errors.endingDate?.message !== undefined}
            id="date-picker-input-id-finish"
            placeholder="mm/dd/yyyy"
            labelText={<RequiredLabel message={"Fin du sprint"}/>}
          />
        </DatePicker>
        <FormLabel style={{color: 'red'}}>{[errors.startingDate?.message, errors.endingDate?.message].join(' ')}</FormLabel>
        <HelperText type={'help'} title={<h4>Status possible du PLD</h4>}
                    helpMessage={<>
                      <p>"Le Pld peut avoir plusieurs états lors de sa conception (ex: Kick-Off, Follow-up...)"</p>
                      <p>Veuillez noté que l'ordre des status est important !</p>
                    </>} logoSize={14}/>
        {showSteps()}
        <Button onClick={onClickCreate} renderIcon={Add} iconDescription={"Create"}>Créer</Button>
      </Stack>
    </>
  );
};
