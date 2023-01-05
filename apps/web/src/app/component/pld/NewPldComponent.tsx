import React, { useContext, useEffect, useState } from "react";
import {UserContext, UserContextProps } from "../../context/UserContext";
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
import {onEnter} from "../../util/FieldData";

import {Stack} from '@carbon/react';

import {Close, ArrowUp, ArrowDown, TrashCan, Add} from '@carbon/icons-react';
import {HelperText} from "../../util/HelperText";
import {RequiredLabel} from "../../util/Label";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { validate } from "class-validator";
import { PldApiController } from "../../controller/PldApiController";

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
  }, [userCtx.accessToken, props.orgId]);

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
    const form = getValues();
    let managerId = form.manager;
    console.log(form);
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
        onChange={(e) => {
          console.log(e.currentTarget.value);
          setValue('manager', e.currentTarget.value)
        }}
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
                     onChange={(evt, {value}) => {
                       if (value === '')
                         return;
                       setValue('promotion', parseInt(value));}}
                     value={watch('promotion')}/>
        <NumberInput id={"pld-version"}
                     required
                     label={<RequiredLabel message={"Version de début"}/>}
                     iconDescription={"Version"}
                     value={watch('version')}
                     min={0}
                     step={org?.versionShifting ?? 0.1}
                     onChange={(evt, {value}) => {
                       if (value === '')
                         return;
                       setValue('version', parseFloat(value));}}/>
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
