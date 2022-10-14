import * as React from "react";
import { DodStatus, Organization, Pld, Template } from "@pld/shared";
import { Button, InlineLoading, Link, Modal, Select, SelectItem } from "carbon-components-react";
import { ModalProps } from "../../util/Modal";
import { useContext, useEffect, useState } from "react";

import {Download} from '@carbon/icons-react';

import {Stack} from '@carbon/react';
import { UserContext, UserContextProps } from "../../context/UserContext";
import { TemplateApiController } from "../../controller/TemplateApiController";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { RequiredLabel } from "../../util/Label";

type Props = {
  pld: Pld
  org: Organization;
  onClickDownload: (template?: Template) => void;
} & ModalProps;

export const GeneratePldModal = (props: Props) => {

  const userCtx = useContext<UserContextProps>(UserContext);
  const [templates, setTemplates] = useState<undefined | Template[]>(undefined);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    TemplateApiController.getTemplates(userCtx.accessToken, props.org._id, (templates, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      } else {
        setTemplates(templates);
        setSelectedTemplate(templates.find((t) => t.useAsDefault) ?? templates[0]);
      }
    })
  }, []);

  const onClickDownload = () => {
    props.onClickDownload(selectedTemplate);
  }

  const showTemplates = () => {
    if (!templates)
      return <InlineLoading description={'Chargement des templates en cours ...'}/>
    if (templates.length === 0) {
      return (
        <div>
          <p>Vous n'avez pas créer de template, un template par défaut sera utilisé.</p>
          <Link onClick={() => navigate(`/organization/${props.org._id}/template/new`)}>Cliquez-ici pour en créer un</Link>
        </div>
      )
    }
    return (<Select
      id="select-1"
      labelText={<RequiredLabel message={"Sélectionner un template"}/>}
      value={selectedTemplate?._id}
      onChange={(event) => {
        setSelectedTemplate(templates.find((a) => a._id === event.currentTarget.value))
      }}
      helperText="Ce template sera utilisé pour générer le document word">
      {templates.map((t, index) => <SelectItem key={index} value={t._id} text={t.title} />)}
    </Select>)
  }

  return (
    <Modal open={props.open}
           onRequestClose={props.onDismiss}
           passiveModal
           modalHeading={<div style={style.title}>Télécharger le document word de votre PLD</div>}>
      <Stack gap={6}>
        {showTemplates()}
        <Button renderIcon={Download} disabled={!templates} onClick={onClickDownload}>
          Télécharger le document
        </Button>
      </Stack>
    </Modal>
  );
};

const style = {
  title: {
    fontWeight: 'bold',
    fontSize: 24,
  }
}
