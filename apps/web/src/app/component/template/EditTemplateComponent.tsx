import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextProps } from "../../context/UserContext";
import { DodStatus, Organization, Template, UpdateTemplateBody } from "@pld/shared";
import { CreateTemplateSettingsComponent, TemplateSettingsForm } from "./create/CreateTemplateSettingsComponent";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { OrganizationApiController } from "../../controller/OrganizationApiController";
import { validate } from "class-validator";
import { toast } from "react-toastify";
import { TemplateApiController } from "../../controller/TemplateApiController";
import { Breadcrumb, BreadcrumbItem, Button, ButtonSet, Checkbox, Column, FormLabel, Grid, TextInput } from "carbon-components-react";
import { RequiredLabel } from "../../util/Label";
import { CreateTemplatePreviewComponent } from "./create/CreateTemplatePreviewComponent";

import {Stack} from '@carbon/react';

import {Renew, TrashCan} from '@carbon/icons-react';

type Props = {
  templateId: string;
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

export const EditTemplateComponent = (props: Props) => {

  const userCtx = useContext<UserContextProps>(UserContext);
  const {getValues, register, setValue, watch} = useForm<TemplateForm>({defaultValues: defaultTemplateForm});
  const [org, setOrg] = useState<Organization | undefined>(undefined);
  const [settings, setSettings] = useState<TemplateSettingsForm | undefined>(undefined);
  const [dodStatus, setDodStatus] = useState<DodStatus[]>([]);

  const [template, setTemplate] = useState<Template | undefined>(undefined);

  useEffect(() => {
    if (template === undefined)
      return;
    setValue('name', template.title);
    setValue('useAsDefault', template?.useAsDefault);
    setSettings({
      dod: template?.dodTemplate,
      description: template?.descriptionTemplate,
      revision: template?.revisionTemplate,
      color: template?.colorTemplate,
      rapport: template?.reportTemplate,
    });
  }, [template]);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrg();
    loadDodStatus();
    loadTemplate();
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

  const loadTemplate = () => {
    TemplateApiController.getTemplate(userCtx.accessToken, props.orgId, props.templateId, (template, error) => {
      if (template) {
        setTemplate(template);
      } else {
        console.log(error);
      }
    })
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
    const body: UpdateTemplateBody = new UpdateTemplateBody(getValues('name'), getValues('useAsDefault'), settings?.color, settings?.dod, settings?.rapport, settings?.revision, settings?.description);
    validate(body).then((err) => {
      if (!org) {
        toast('Impossible de récupérer l\'organisation actuelle !', {type: 'error'});
      } else {
        TemplateApiController.updateTemplate(userCtx.accessToken, props.orgId, props.templateId, body, (template, error) => {
          if (error) {
            toast('Une erreur est survenue !', {type: 'error'})
          } else {
            toast('Template mis à jour avec succès', {type: 'success'});
          }
        });
      }
    });
  }

  const onClickDelete = () => {
    TemplateApiController.deleteTemplate(userCtx.accessToken, props.orgId, props.templateId, (template, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      } else {
        toast('Template supprimer avec succès', {type: 'success'});
        navigate(`/organization/${props.orgId}`);
      }
    })
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
        <h1 style={{fontWeight: 'bold'}}>Éditer un template</h1>
        <TextInput {...register('name')} helperText={"le titre doit contenir au minimum 3 caractères et maximum 128 caractères"} id={"template-name"} labelText={<RequiredLabel message={"Nom"}/>}/>
        <div>
          <Checkbox id={"template-default"} labelText={"Template par défaut ?"} checked={watch('useAsDefault')} onChange={(a, {checked}) => setValue('useAsDefault', checked)}/>
          <FormLabel style={{display: !watch('useAsDefault') ? 'none' : 'inline'}}>Ce template sera utilisé par défaut pour générer vos documents</FormLabel>
        </div>
        <Grid>
          <Column lg={8} md={8} sm={4}>
            {org ? <CreateTemplateSettingsComponent org={org} dodStatus={dodStatus} onGeneratePreview={onClickGeneratePreview} settings={settings}/> : null}
          </Column>
          <Column lg={8} md={8} sm={4}>
            {org ? <CreateTemplatePreviewComponent org={org} dodStatus={dodStatus} settings={settings}/> : null}
          </Column>
        </Grid>
        <ButtonSet>
          <Button renderIcon={Renew} onClick={onClickCreate}>Mettre à jour</Button>
          <Button renderIcon={TrashCan} onClick={onClickDelete} kind={'danger'}>Supprimer</Button>
        </ButtonSet>
      </Stack>
    </>
  );
};
