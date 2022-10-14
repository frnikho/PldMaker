import * as React from "react";
import { Breadcrumb, BreadcrumbItem, Button, ButtonSet, Checkbox, Column, FormLabel, Grid, TextInput } from "carbon-components-react";

import {Stack} from '@carbon/react';

import {Add} from '@carbon/icons-react';

import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextProps } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { OrganizationApiController } from "../../controller/OrganizationApiController";
import { DodStatus, NewTemplateBody, Organization } from "@pld/shared";
import { CreateTemplateSettingsComponent, TemplateSettingsForm } from "./create/CreateTemplateSettingsComponent";
import { CreateTemplatePreviewComponent } from "./create/CreateTemplatePreviewComponent";
import { RequiredLabel } from "../../util/Label";
import { validate } from "class-validator";
import { TemplateApiController } from "../../controller/TemplateApiController";
import { toast } from "react-toastify";

type Props = {
  orgId: string;
};

type TemplateForm = {
  name: string;
  useAsDefault: boolean;
}

const defaultTemplateForm: TemplateForm = {
  name: 'Mon nouveau template',
  useAsDefault: false,
}

export const CreateTemplateComponent = (props: Props) => {

  const userCtx = useContext<UserContextProps>(UserContext);
  const [org, setOrg] = useState<Organization | undefined>(undefined);
  const [settings, setSettings] = useState<TemplateSettingsForm | undefined>(undefined);
  const [dodStatus, setDodStatus] = useState<DodStatus[]>([]);
  const {getValues, register, setValue, watch} = useForm<TemplateForm>({defaultValues: defaultTemplateForm});
  const navigate = useNavigate();

  useEffect(() => {
    loadOrg();
    loadDodStatus();
  }, []);

  const loadOrg = () => {
    OrganizationApiController.findOrganizationById(userCtx.accessToken, props.orgId, (org, error) => {
      if (org) {
        setOrg(org)
      } else {
        console.log(error);
      }
    });
  }

  const loadDodStatus = () => {
    OrganizationApiController.getOrgDodStatus(userCtx.accessToken, props.orgId, (dodStatus, error) => {
      if (dodStatus) {
        setDodStatus(dodStatus);
      } else {
        console.log(error);
      }
    });
  }

  const onClickCreate = () => {
    console.log(getValues());
    console.log(settings);
    const body: NewTemplateBody = new NewTemplateBody(getValues('name'), getValues('useAsDefault'), settings?.color, settings?.dod, settings?.rapport, settings?.revision, settings?.description);
    validate(body).then((err) => {
      if (!org) {
        toast('Impossible de récupérer l\'organisation actuelle !', {type: 'error'});
      } else {
        TemplateApiController.createTemplate(userCtx.accessToken, org._id, body, (template, error) => {
          if (error) {
            toast('Une erreur est survenue !', {type: 'error'})
          } else {
            toast('Template créer avec succès', {type: 'success'});
            navigate(`/organization/${props.orgId}`);
          }
        });
      }
    });
  }

  const onClickGeneratePreview = (template: TemplateSettingsForm) => {
    setSettings(template);
  }

  return (
    <>
      <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
        <BreadcrumbItem onClick={() => navigate(`/`)}>Dashboard</BreadcrumbItem>
        <BreadcrumbItem onClick={() => navigate(`/organization/${props.orgId}`)}>Organisation</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Template</BreadcrumbItem>
      </Breadcrumb>
      <Stack gap={6}>
        <h1 style={{fontWeight: 'bold'}}>Créer un nouveau template</h1>
        <TextInput {...register('name')} helperText={"le titre doit contenir au minimum 3 caractères et maximum 128 caractères"} id={"template-name"} labelText={<RequiredLabel message={"Nom"}/>}/>
        <div>
          <Checkbox id={"template-default"} labelText={"Template par défaut ?"} checked={watch('useAsDefault')} onChange={(a, {checked}) => setValue('useAsDefault', checked)}/>
          <FormLabel style={{display: !watch('useAsDefault') ? 'none' : 'inline'}}>Ce template sera utilisé par défaut pour générer vos documents</FormLabel>
        </div>
        <Grid>
          <Column lg={8} md={8} sm={4}>
            {org ? <CreateTemplateSettingsComponent org={org} dodStatus={dodStatus} onGeneratePreview={onClickGeneratePreview}/> : null}
          </Column>
          <Column lg={8} md={8} sm={4}>
            {org ? <CreateTemplatePreviewComponent org={org} dodStatus={dodStatus} settings={settings}/> : null}
          </Column>
        </Grid>
        <ButtonSet>
          <Button renderIcon={Add} onClick={onClickCreate}>Créer</Button>
        </ButtonSet>
      </Stack>
    </>
  );
};
