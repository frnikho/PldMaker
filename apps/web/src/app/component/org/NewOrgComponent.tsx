import React from "react";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Column,
  FluidForm,
  Grid,
  NumberInput, StructuredListBody, StructuredListCell, StructuredListHead, StructuredListRow,
  StructuredListWrapper,
  TextArea,
  TextInput, Tile
} from "carbon-components-react";

import {Stack} from '@carbon/react';

import {Add, Subtract} from '@carbon/icons-react';
import {Organization, CreateOrganizationBody} from "@pld/shared";
import {UserApiController} from "../../controller/UserApiController";
import {HelpLabel, RequiredLabel} from "../../util/Label";
import {validate} from "class-validator";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../hook/useLanguage";
import { useAuth } from "../../hook/useAuth";
import { useForm } from "react-hook-form";
import { errorToast, successToast } from "../../manager/ToastManager";
import { Title } from "../text/Title";

type Form = {
  name: string;
  description: string;
  versionShifting: number;
  invitedUsers: { value: string, label: string }[];
  invitedUserInput: string;
};

type Props = {
  onOrgCreated: (createdOrg: Organization) => void;
}

export const NewOrgComponent = (props: Props) => {

  const {accessToken, user} = useAuth();
  const navigate = useNavigate();
  const {translate} = useLanguage();
  const {getValues, clearErrors, setError, watch, setValue, formState: {errors}} = useForm<Form>({defaultValues: {versionShifting: 0.1, description: '', name: '', invitedUsers: [], invitedUserInput: ''}});

  const onClickRemoveUser = (user: { label: string, value: string }, index: number) => {
    const array = getValues('invitedUsers');
    array.splice(index, 1);
    setValue('invitedUsers', array);
  }

  const onClickAddUser = () => {
    if (getValues('invitedUsers').filter((user) => user.label === getValues('invitedUserInput')).length > 0) {
      return setError('invitedUserInput', {message: 'l\'utilisateur est déja dans la liste'});
    }
    if (getValues('invitedUserInput') === user?.email) {
      return setError('invitedUserInput', {message: 'vous ne pouvez vous ajoutez vous mêmes aux members'});
    }
    UserApiController.findUserByEmail(accessToken, getValues('invitedUserInput'), (user, error) => {
      if (user !== null && !error) {
        const array = getValues('invitedUsers');
        array.push({
          label: user.email,
          value: user._id,
        });
        clearErrors('invitedUserInput');
        setValue('invitedUsers', array);
      } else {
        setError('invitedUserInput', {message: "l'utilisateur n'a pas de compte sur le PLD Maker"});
      }
    });
  }

  const onClickCreateOrg = () => {
    const form = getValues();
    const body: CreateOrganizationBody = new CreateOrganizationBody(
      form.name,
      form.description,
      form.versionShifting,
      form.invitedUsers.map((user) => user.value),
    );
    validate(body).then((errors) => {
      errors.forEach((err) => {
        const msg = Object.entries(err.constraints ?? {}).map((a) => a[1]);
        setError(err.property as keyof Form, {message: msg.join(', ')});
      })
      if (errors.length === 0) {
        OrganizationApiController.createUserOrganizations(accessToken, body, (org, error) => {
          if (org !== null && error === undefined) {
            successToast('Votre organisation a été créée');
            props.onOrgCreated(org);
          } else {
            errorToast('Impossible de créer votre organisation !');
          }
        });
      }
    });
  }

  const onChangeVersioning = (value: string) => {
    const versioning = parseFloat(value);
    if (!isNaN(versioning)) {
      setValue('versionShifting', versioning);
    } else {
      setValue('versionShifting', 0);
    }
  }

  return (
    <>
      <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
        <BreadcrumbItem onClick={() => navigate('/')}>Dashboard</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Organisation</BreadcrumbItem>
      </Breadcrumb>
      <Title style={{fontWeight: 'bold', fontSize: 24}}>{translate('pages.createOrg.title')}</Title>
      <Title style={{fontSize: 14, marginTop: 10}}>{translate('pages.createOrg.subtitle')}</Title>
      <Grid style={{marginTop: 20}}>
        <Column sm={4} md={8} lg={10} xlg={10}>
          <Stack gap={3}>
            <RequiredLabel message={translate('lexical.name')}/>
            <TextInput helperText={"le nom doit contenir au minimum 5 caractères et 64 au maximum"} maxLength={64} minLength={5} id={"new-org-name"} labelText={false} invalid={errors?.name?.message !== undefined} invalidText={errors?.name?.message} onChange={(event) => setValue('name', event.currentTarget.value)}/>
            <TextArea helperText={"la description ne doit pas dépasser 512 caractères"} maxLength={512} rows={4} id={"new-org-desc"} invalid={errors?.description?.message !== undefined} invalidText={errors?.description?.message} labelText={"Description"} onChange={(event) => setValue('description', event.currentTarget.value)}/>
            <RequiredLabel message={translate('lexical.versioning')}/>
            <NumberInput helperText={"minimum 0.01 et au maximum 2.00"} iconDescription={"step de 0.1"} id={"new-org-versionShifting"} invalid={errors?.versionShifting?.message !== undefined} invalidText={errors?.versionShifting?.message} value={watch('versionShifting') ?? 0} max={2.0} min={0.01} step={0.1} onChange={(e, {value}) => onChangeVersioning(value)}/>
            <HelpLabel message={'Le versioning correspond aux gap de la monté de version lors de chaque mise à jour de votre pld'}/>
          </Stack>
        </Column>
        <Column sm={4} md={8} lg={5} xlg={6}>
          <Tile style={{padding: 10}}>
            <h4 style={{fontWeight: 'bold'}}>{translate('pages.createOrg.addMembers.title')}</h4>
            <p style={{fontStyle: 'italic'}}>{translate('pages.createOrg.addMembers.subtitle')}</p>
            <FluidForm style={{marginTop: '20px'}}>
              <Grid narrow>
                <Column sm={3} md={7} lg={4} style={{paddingRight: 20, paddingLeft: 20}}>
                  <TextInput
                    invalid={errors?.invitedUserInput?.message !== undefined}
                    invalidText={errors?.invitedUserInput?.message}
                    id="af" type="text" labelText={translate('lexical.email')} onChange={(e) => setValue('invitedUserInput', e.currentTarget.value)}/>
                </Column>
                <Column lg={1} style={{margin: 'auto'}}>
                  <Button
                    size={"lg"}
                    kind={"primary"}
                    onClick={onClickAddUser}
                    renderIcon={Add}
                    iconDescription="Add user"
                    hasIconOnly/>
                </Column>
              </Grid>
              <StructuredListWrapper>
                <StructuredListHead>
                  <StructuredListRow head tabIndex={0}>
                    <StructuredListCell head>
                      Email
                    </StructuredListCell>
                  </StructuredListRow>
                </StructuredListHead>
                <StructuredListBody>
                  {watch('invitedUsers').map((user, index) => {
                    return (<StructuredListRow key={index} tabIndex={0} style={{margin: 'auto'}}>
                      <StructuredListCell style={{margin: 'auto'}}>
                        {user.label}
                      </StructuredListCell>
                      <StructuredListCell>
                        <Button
                          size={"sm"}
                          kind={"tertiary"}
                          onClick={() => onClickRemoveUser(user, index)}
                          renderIcon={Subtract}
                          iconDescription="Retirer l'utilisateur"
                          hasIconOnly/>
                      </StructuredListCell>
                    </StructuredListRow>)
                  })}
                </StructuredListBody>
              </StructuredListWrapper>
            </FluidForm>
          </Tile>
        </Column>
      </Grid>
      <Button renderIcon={Add} iconDescription={"Create"} style={{marginTop: '20px'}} onClick={onClickCreateOrg}>
        {translate('pages.createOrg.createButton')}
      </Button>
    </>
  );
};
