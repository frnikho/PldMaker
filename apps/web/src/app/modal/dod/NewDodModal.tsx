import React, { useEffect } from "react";
import {
  Button,
  Column, ComboBox,
  Grid,
  Modal,
  TextArea,
  TextInput
} from "carbon-components-react";
import { Dod, DodCreateBody, Organization, OrganizationSection, Pld } from "@pld/shared";
import { ModalProps } from "../../util/Modal";
import { useAuth } from "../../hook/useAuth";
import { useForm } from "react-hook-form";
import { validate } from "class-validator";
import { DodApiController } from "../../controller/DodApiController";
import { ErrorLabel, RequiredLabel } from "../../util/Label";
import { DefinitionDodComponent } from "./new/DefinitionDodComponent";
import { UserWorkTimeDodComponent } from "./new/UserWorkTimeDodComponent";

import {Stack} from '@carbon/react';

export enum DodType {
  New,
  Preview,
  Edit,
}

type Props = {
  type: DodType;
  pld: Pld;
  org: Organization;
  sections: OrganizationSection[];
  dod?: Dod;
} & ModalProps;

export type WorkTime = {
  users: {id: string, email: string}[];
  value: number;
}

type Forms = {
  version: string;
  title: string;
  skinOf: string;
  want: string;
  description: string;
  descriptionOfDone: string[];
  estimatedWorkTime: WorkTime[];
};

const defaultForm: Forms = {
  version: '',
  title: '',
  skinOf: '',
  want: '',
  description: '',
  descriptionOfDone: [''],
  estimatedWorkTime: [{value: 0, users: []}],
}

export const NewDodModal = (props: Props) => {

  const {accessToken, user} = useAuth();
  const {register, reset, getValues, clearErrors, setValue, watch, formState: {errors}, setError} = useForm<Forms>({defaultValues: defaultForm});

  useEffect(() => {
    if (props.dod !== undefined) {
      setValue('title', props.dod.title);
      setValue('version', props.dod.version);
      setValue('skinOf', props.dod.skinOf);
      setValue('want', props.dod.want);
      setValue('description', props.dod.description);
      setValue('descriptionOfDone', props.dod.descriptionOfDone);
      setValue('estimatedWorkTime', props.dod.estimatedWorkTime.map((wt) => ({
        value: wt.value,
        users: wt.users.map((u) => ({ id: u._id, email: u.email })),
      })));
    }
  }, [props.open]);

  const addBlankWorkTime = () => {
    const workTime = getValues('estimatedWorkTime');
    workTime.push({
      users: [],
      value: 0
    });
    setValue('estimatedWorkTime', workTime);
  }

  const addBlankDefinition = () => {
    const array = getValues('descriptionOfDone');
    array.push('');
    setValue('descriptionOfDone', array);
  }

  const onWtChanged = (wtIndex: number, newWt: WorkTime) => {
    const workTime = getValues('estimatedWorkTime');
    workTime[wtIndex] = newWt;
    setValue('estimatedWorkTime', workTime);
  }

  const onWtDeleted = (wtIndex: number) => {
    if (wtIndex <= 0)
      return;
    const workTime = getValues('estimatedWorkTime');
    workTime.splice(wtIndex, 1);
    setValue('estimatedWorkTime', workTime);
  }

  const onDefinitionEdited = (index: number, definition: string) => {
    const array = getValues('descriptionOfDone');
    array[index] = definition;
    setValue('descriptionOfDone', array);
  }

  const onDefinitionDeleted = (index: number) => {
    if (index <= 0)
      return;
    const array = getValues('descriptionOfDone');
    array.splice(index, 1);
    setValue('descriptionOfDone', array);
  }

  const getVersionSelection = () => {
    return props.sections.map((section) => {
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
  }

  const onClickCreate = () => {
    const form = getValues();
    clearErrors();
    const body: DodCreateBody = new DodCreateBody(form.version, form.title, form.skinOf, form.want,
      form.description,
      props.pld._id,
      user?._id ?? '',
      form.descriptionOfDone,
      form.estimatedWorkTime.map((a) => ({users: a.users.map((u) => u.id), value: a.value, format: 'J/H'})),
    );
    validate(body).then((errors) => {
      console.log(errors);
      if (errors.length <= 0)
        return true;
      errors.forEach((error) => {
        const msg = Object.entries(error.constraints ?? {}).map((a) => a[1]);
        setError(error.property as keyof Forms, { message: msg.join(', ') });
      })
      return false;
    }).then((valid) => {
      if (!valid)
        return;
      if (props.type === DodType.New) {
        DodApiController.createDod(accessToken, props.org._id, props.pld._id, body, (dod, error) => {
          if (!error && dod !== null) {
            props.onSuccess(dod);
            reset();
          } else {
            console.error(error);
          }
        });
      } else {
        DodApiController.updateDod(accessToken, props.org._id, props.pld._id, props.dod?._id ?? '', body, (dod, error) => {
          if (!error && dod !== null) {
            props.onSuccess(dod);
            reset();
          } else {
            console.error(error);
          }
        });
      }
    });
  }

  const showInputSelect = () => {
    if (getValues('version') === '') {
      return (
        <ComboBox id={'select-version'}
                  placeholder={'1.1.0 ...'}
                  titleText={<RequiredLabel message={"Version"}/>}
                  invalid={errors.version?.message !== undefined}
                  invalidText={errors.version?.message}
                  value={watch('version')}
                  onChange={(a) => setValue('version', a?.selectedItem?.version ?? '')}
                  items={getVersionSelection()}
                  itemToString={(a) => `${a?.name}`}
        />);
    } else {
      return (
        <TextInput id={'input-version'}
                   invalid={errors.version?.message !== undefined}
                   invalidText={errors.version?.message}
                   labelText={<RequiredLabel message={"Version"}/>} {...register('version')}/>
      )
    }
  }

  return (
    <Modal
      size={"md"}
      open={props.open}
      passiveModal
      secondaryButtonText={"Fermer"}
      onRequestClose={props.onDismiss}
      modalHeading={props.type === DodType.Edit ? 'Modification de la DoD' : "Créer une nouvelle DoD"}>
      <Stack gap={3}>
        <Grid>
          <Column lg={3} md={3}>
            {showInputSelect()}
          </Column>
          <Column lg={8} md={5}>
            <TextInput
              invalid={errors.title?.message !== undefined}
              invalidText={errors.title?.message}
              placeholder={'Mettre en place le vps....'}
              value={watch('title')}
              onChange={(e) => setValue('title', e.currentTarget.value)}
              id={"dod-title"} labelText={<RequiredLabel message={"Nom du DoD"}/>}/>
          </Column>
        </Grid>
        <Grid>
          <Column lg={3} md={3}>
            <TextInput
              placeholder={'Développeur'}
              invalid={errors.skinOf?.message !== undefined}
              invalidText={errors.skinOf?.message}
              value={watch('skinOf')}
              onChange={(e) => setValue('skinOf', e.currentTarget.value)}
              id={"dod-skinOf"} labelText={<RequiredLabel message={"En tant que ..."}/>} />
          </Column>
          <Column lg={8} md={5}>
            <TextInput
              invalid={errors.want?.message !== undefined}
              invalidText={errors.want?.message}
              placeholder={'Pouvoir créer une bouton sur le vps'}
              value={watch('want')}
              onChange={(e) => setValue('want', e.currentTarget.value)}
              id={"dod-want"} labelText={<RequiredLabel message={"Je veux ..."}/>} />
          </Column>
        </Grid>
        <TextArea
          rows={2}
          placeholder={'En cliquant sur le bouton "X" je souhaite configurer le vps'}
          value={watch('description')}
          invalid={errors.description?.message !== undefined}
          invalidText={errors.description?.message}
          onChange={(e) => setValue('description', e.currentTarget.value)}
          id={"dod-description"} labelText={<RequiredLabel message={"Description"}/>}/>
        <DefinitionDodComponent definitions={watch('descriptionOfDone')} onDefinitionEdited={onDefinitionEdited} onDefinitionDeleted={onDefinitionDeleted}/>
        <ErrorLabel show={errors?.descriptionOfDone?.message !== undefined} message={errors?.descriptionOfDone?.message}/>
        <Button kind={'ghost'} onClick={addBlankDefinition}>Ajouter une définition</Button>
        <UserWorkTimeDodComponent workTime={watch('estimatedWorkTime')} org={props.org} onWtChanged={onWtChanged} onWtDeleted={onWtDeleted}/>
        <ErrorLabel show={errors?.estimatedWorkTime?.message !== undefined} message={errors?.estimatedWorkTime?.message}/>
        <Button kind={'ghost'} onClick={addBlankWorkTime}>Ajouter des charges</Button>
        <br/>
        <Button onClick={onClickCreate}>{props.type === DodType.New ? 'Créer' : 'Modifier'}</Button>
      </Stack>
    </Modal>
  );
};
