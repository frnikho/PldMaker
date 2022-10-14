import * as React from "react";
import {
  defaultTemplateDescription, defaultTemplateDod, defaultTemplateReport,
  defaultTemplateRevision,
  DodStatus,
  Organization,
  TemplateColor,
  TemplateDescription,
  TemplateDod,
  TemplateReport,
  TemplateRevision,
  UserDomain
} from "@pld/shared";
import { Accordion, AccordionItem, Button, FormLabel, MultiSelect, TextInput, Tile } from "carbon-components-react";
import { useForm } from "react-hook-form";

import {Stack} from '@carbon/react';
import { useEffect } from "react";
import { TwitterPicker } from "react-color";
import useEventListener from "@use-it/event-listener";

type Props = {
  org: Organization;
  dodStatus: DodStatus[];
  settings?: TemplateSettingsForm;
  onGeneratePreview: (settings: TemplateSettingsForm) => void;
};

export type TemplateSettingsForm = {
  color: TemplateColor,
  description: TemplateDescription,
  revision: TemplateRevision
  dod: TemplateDod,
  rapport: TemplateReport,
};

export const CreateTemplateSettingsComponent = (props: Props) => {

  const {watch, getValues, setValue, register} = useForm<TemplateSettingsForm>({
    defaultValues: {
      color: {
        mainColor: '#77b243',
        secondaryColor: '#dcdcdc',
        tertiaryColor: '#dcdcdc',
      },
      description: defaultTemplateDescription,
      revision: defaultTemplateRevision,
      dod: defaultTemplateDod,
      rapport: defaultTemplateReport,
    }
  });

  useEffect(() => {
    if (props.settings !== undefined) {
      setValue('rapport', props.settings.rapport);
      setValue('color', props.settings.color);
      setValue('dod', props.settings.dod);
      setValue('description', props.settings.description);
      setValue('revision', props.settings.revision);
    }
  }, [props.settings]);

  useEffect(() => {
    props.onGeneratePreview(getValues());
  }, [])

  useEventListener('keydown', (event) => {
    if (event['key'] === 'Enter' && event['ctrlKey']) {
      props.onGeneratePreview(getValues());
    }
  });

  const showRapportDodStatusSelect = () => {
    const items = props.dodStatus.map((a) => ({id: a._id, value: a.name}));
    return (
      <MultiSelect id={'rapport.dod_status'}
                   titleText={"Prendre en compte les DoDs ayant ces status:"}
                   items={items}
                   label={watch('rapport.generateDodWithStatus').map((a) => a.value).join(', ')}
                   itemToString={(a) => a.value}
                   selectedItems={watch('rapport.generateDodWithStatus')}
                   onChange={({ selectedItems }) => {
                     setValue('rapport.generateDodWithStatus', selectedItems);
                   }
      }/>
    )
  }
  return (
    <Tile >
      <Accordion>
        <AccordionItem title={<h4 style={{fontWeight: 'bold', marginBottom: 16}}>Couleurs</h4>}>
          <Stack gap={4}>
            <>
              <FormLabel>Couleur primaire</FormLabel>
              <TwitterPicker triangle={'hide'} onChangeComplete={(color) => setValue('color.mainColor', color.hex)} color={watch('color.mainColor')}/>
            </>
            <>
              <FormLabel>Couleur secondaire</FormLabel>
              <TwitterPicker triangle={'hide'} onChangeComplete={(color) => setValue('color.secondaryColor', color.hex)} color={watch('color.secondaryColor')}/>
            </>
          </Stack>
        </AccordionItem>
        <AccordionItem title={<h4 style={{fontWeight: 'bold', marginBottom: 16}}>Description du documents</h4>}>
          <Stack>
            <TextInput {...register('description.title.title.text')} id={'description.title.text'} labelText={"Titre (Titre)"}/>
            <TextInput {...register('description.title.content.text')} id={'description.content.text'} labelText={"Titre (Contenue)"}/>
            <TextInput {...register('description.object.title.text')} id={'description.object.title.text'} labelText={"Objet (Titre)"}/>
            <TextInput {...register('description.object.content.text')} id={'description.object.content.text'} labelText={"Object (Contenue)"}/>
            <TextInput {...register('description.author.title.text')} id={'description.author.title.text'} labelText={"Auteur (Titre)"}/>
            <TextInput {...register('description.author.content.text')} id={'description.author.content.text'} labelText={"Auteur (Contenu)"}/>
            <TextInput {...register('description.manager.title.text')} id={'description.manager.title.text'} labelText={"Responsable (Titre)"}/>
            <TextInput {...register('description.manager.content.text')} id={'description.manager.content.text'} labelText={"Responsable (Contenue)"}/>
          </Stack>
        </AccordionItem>
        <AccordionItem title={<h4 style={{fontWeight: 'bold', marginBottom: 16}}>Tableau des révisions</h4>}>
          <Stack>
            <TextInput {...register('revision.date.title.text')} id={'revision.date.title.text'} labelText={"Date (Titre)"}/>
            <TextInput {...register('revision.date.content.text')} id={'revision.date.content.text'} labelText={"Date (Contenue)"}/>
            <TextInput {...register('revision.version.title.text')} id={'revision.version.title.text'} labelText={"Version (Titre)"}/>
            <TextInput {...register('revision.version.content.text')} id={'revision.version.content.text'} labelText={"Version (Contenue)"}/>
            <TextInput {...register('revision.author.title.text')} id={'revision.author.title.text'} labelText={"Auteur (Titre)"}/>
            <TextInput {...register('revision.author.content.text')} id={'revision.author.content.text'} labelText={"Auteur (Contenue)"}/>
            <TextInput {...register('revision.sections.title.text')} id={'revision.sections.title.text'} labelText={"Sections (Titre)"}/>
            <TextInput {...register('revision.sections.content.text')} id={'revision.sections.content.text'} labelText={"Sections (Contenue)"}/>
            <TextInput {...register('revision.comments.title.text')} id={'revision.comments.title.text'} labelText={"Commentaires (Titre)"}/>
            <TextInput {...register('revision.comments.content.text')} id={'revision.comments.content.text'} labelText={"Commentaires (Contenue)"}/>
          </Stack>
        </AccordionItem>
        <AccordionItem open={true} title={<h4 style={{fontWeight: 'bold', marginBottom: 16}}>DoDs</h4>}>
          <Stack gap={1}>
            <TextInput {...register('dod.title.text')} id={'dod.title'} labelText={"Titre de la DoD"}/>
            <TextInput {...register('dod.skinOf.title.text')} id={'dod.skinOf'} labelText={"En tant que (Titre)"}/>
            <TextInput {...register('dod.skinOf.content.text')} id={'dod.skinOf.content'} labelText={"En tant que (Contenue)"}/>
            <TextInput {...register('dod.wantTo.title.text')} id={'dod.wantTo'} labelText={"Je veux... (Titre)"}/>
            <TextInput {...register('dod.wantTo.content.text')} id={'dod.wantTo.content'} labelText={"Je veux... (Contenue)"}/>
            <TextInput {...register('dod.description.title.text')} id={'dod.description'} labelText={"Description (Titre)"}/>
            <TextInput {...register('dod.description.content.text')} id={'dod.description.content'} labelText={"Description (Contenue)"}/>
            <TextInput {...register('dod.definitionOfDone.title.text')} id={'dod.definition.title'} labelText={"Definition of done (Titre)"}/>
            <TextInput {...register('dod.definitionOfDone.content.text')} id={'dod.definition.content'} labelText={"Definition of done (Contenue de chaque definition)"}/>
            <TextInput {...register('dod.estimatedWorkTime.title.text')} id={'dod.estimated_work_time'} labelText={"Charges estimées (Titre)"}/>
            <TextInput {...register('dod.estimatedWorkTime.content.text')} id={'dod.estimated_work_time.content'} labelText={"Charges estimées (Contenue de chaque charges)"}/>
          </Stack>
        </AccordionItem>
        <AccordionItem open={true} title={<h4 style={{fontWeight: 'bold', marginBottom: 16}}>Rapport d'avancement</h4>}>
          <Stack gap={4}>
            <TextInput {...register('rapport.title.text')} id={"rapport.format"} labelText={"Titre"}/>
            <TextInput {...register('rapport.subtitle')} id={"rapport.title"} labelText={"Sous titre"}/>
            <TextInput {...register('rapport.globalProgress.title.text')} id={'rapport.progress.title'} labelText={"Progression"}/>
            <MultiSelect id={'progress.section'} label={watch('rapport.globalProgress.generateSections').join(', ')} items={Object.values(UserDomain)} itemToString={(a) => a.toString()} selectedItems={watch('rapport.globalProgress.generateSections')} onChange={({selectedItems}) => {
              setValue('rapport.globalProgress.generateSections', selectedItems);
            }}/>
            <TextInput {...register('rapport.progress.title.text')} id={'progress.title'} labelText={"Titre avancement individuel"}/>
            <TextInput {...register('rapport.progress.subtitle.text')} id={'progress.subtitle'} labelText={"Titre travail individuel"}/>
            {showRapportDodStatusSelect()}
            <TextInput {...register('rapport.userDod.user.text')} id={'rapport.user.title'} labelText={"Utilisateur"}/>
            <TextInput {...register('rapport.userDod.status.text')} id={'rapport.user.status'} labelText={"Status"}/>
            <TextInput {...register('rapport.userDod.dods.text')} id={'rapport.user.dod'} labelText={"DoDs"}/>
            <TextInput {...register('rapport.blockingPoint.text')} id={'rapport.blocking_points'} labelText={"Points bloquants"}/>
            <TextInput {...register('rapport.globalComment.text')} id={'rapport.global_comments'} labelText={"Commentaire général"}/>
          </Stack>
        </AccordionItem>
      </Accordion>
      <Button onClick={() => props.onGeneratePreview(getValues())}>
        Générer le résultat
      </Button>
    </Tile>
  );
};
