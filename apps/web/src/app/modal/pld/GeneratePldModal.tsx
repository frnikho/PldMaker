import * as React from "react";
import { Organization, Pld, Template, UserDomain } from "@pld/shared";
import { Button, InlineLoading, Link, Modal, Select, SelectItem, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TextArea, TextInput } from "carbon-components-react";
import { ModalProps } from "../../util/Modal";
import { useContext, useEffect, useState } from "react";

import {Download} from '@carbon/icons-react';

import {Stack} from '@carbon/react';
import { UserContext, UserContextProps } from "../../context/UserContext";
import { TemplateApiController } from "../../controller/TemplateApiController";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { RequiredLabel } from "../../util/Label";
import { useForm } from "react-hook-form";

type Props = {
  pld: Pld
  org: Organization;
  onClickDownload: (value: ReportForm, template?: Template) => void;
} & ModalProps;

export type ReportForm = {
  blockingPoints: string;
  globalComment: string;
  sectionsProgress: {section: string, progress: string}[];
}

export const GeneratePldModal = (props: Props) => {

  const userCtx = useContext<UserContextProps>(UserContext);
  const [templates, setTemplates] = useState<undefined | Template[]>(undefined);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>(undefined);
  const {getValues, watch, register, setValue} = useForm<ReportForm>({defaultValues: {blockingPoints: '', globalComment: '',
      sectionsProgress: Object.values(UserDomain).map((s) => ({section: s, progress: ''}))}})
  const navigate = useNavigate();

  useEffect(() => {
    TemplateApiController.getTemplates(userCtx.accessToken, props.org._id, (templates, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      } else {
        const selectedTemplate = templates.find((t) => t.useAsDefault) ?? templates[0];
        setTemplates(templates);
        setSelectedTemplate(selectedTemplate);
      }
    })
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      setValue('sectionsProgress', selectedTemplate.reportTemplate.globalProgress.generateSections.map((s) => ({section: s, progress: ''})))
    }
  }, [selectedTemplate])

  const onClickDownload = () => {
    props.onClickDownload(getValues(), selectedTemplate);
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

  const showDomainProgress = () =>
    <Table size="sm">
      <TableHead>
        <TableRow id={"DodHeader"} key={"DodHeader"}>
          <TableHeader id={"DodHeaderName"} key={"DodHeaderName"}>
            Section
          </TableHeader>
          <TableHeader>
            Progression
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {watch('sectionsProgress').map((v, index) =>
            <TableRow key={index} >
              <TableCell>{v.section}</TableCell>
              <TableCell>
                <TextInput id={v.section} labelText={""} value={v.progress} onChange={(e) => {
                  const array = getValues('sectionsProgress');
                  array[index].progress = e.currentTarget.value;
                  setValue('sectionsProgress', array);
                }}/>
              </TableCell>
            </TableRow>
          )}
      </TableBody>
    </Table>


  return (
    <Modal open={props.open}
           onRequestClose={props.onDismiss}
           passiveModal
           modalHeading={<div style={style.title}>Télécharger le document word de votre PLD</div>}>
      <Stack gap={6}>
        {showTemplates()}
        {showDomainProgress()}
        <TextArea {...register('blockingPoints')} rows={2} labelText={"Points bloquants"}/>
        <TextArea {...register('globalComment')} rows={2} labelText={"Commentaire général"}/>
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
