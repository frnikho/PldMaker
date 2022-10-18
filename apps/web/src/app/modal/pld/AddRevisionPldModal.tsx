import React from "react";
import {ModalProps} from "../../util/Modal";
import {Modal, MultiSelect, TextArea} from "carbon-components-react";
import {PldApiController} from "../../controller/PldApiController";
import {Organization, Pld} from "@pld/shared";
import {toast} from "react-toastify";

import {Stack} from '@carbon/react'
import {RequiredLabel} from "../../util/Label";
import { useAuth } from "../../hook/useAuth";
import { useForm } from "react-hook-form";

type Props = {
  pld: Pld;
  org: Organization;
} & ModalProps;

type Form = {
  comment: string;
  sections: string[];
}

export const AddRevisionPldModal = (props: Props) => {

  const {accessToken, user} = useAuth();
  const {getValues, watch, setValue, formState: {errors}} = useForm<Form>({defaultValues: {comment: '', sections: []}});

  const onClickAddRevision = () => {
    PldApiController.addRevision(accessToken, props.org._id, props.pld._id, {
      owner: user?._id ?? 'null',
      comments: getValues('comment'),
      version: parseFloat((props.org.versionShifting + props.pld.version).toFixed(2)),
      sections: getValues('sections'),
      created_date: new Date(),
      currentStep: props.pld.currentStep,
    }, (pld, error) => {
      if (error) {
        toast(error.error, {type: 'error'});
      }
      if (pld !== null) {
        props.onSuccess(pld);
      }
    })
  }

  return (
    <Modal
      size={"md"}
      open={props.open}
      primaryButtonText={"Ajouter"}
      onRequestSubmit={onClickAddRevision}
      secondaryButtonText={"Fermer"}
      onRequestClose={props.onDismiss}
      modalHeading="Ajouter une révision">
      <Stack gap={4}>
        <MultiSelect
          label={watch('sections').length === 0 ? "Veuillez choisir la/les section(s) modifiée(s)" : watch('sections').join(', ')}
          titleText={<RequiredLabel message={"Sections modifiées"}/>}
          id="revision-section"
          invalid={errors.sections?.message !== undefined}
          invalidText={errors.sections?.message}
          items={['Toutes', 'DoDs', 'Informations', 'Status'].map((e) => ({label: e}))}
          onChange={(e) => {
            setValue('sections', e.selectedItems.map((a) => a.label));
          }}
        />
        <TextArea
          labelText={<RequiredLabel message={"Commentaires"}/>}
          rows={4} id={"comments"} onChange={(e) => {
            setValue('comment', e.currentTarget.value)
        }}/>
      </Stack>
    </Modal>
  );
};
