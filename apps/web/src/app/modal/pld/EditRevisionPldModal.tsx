import { ModalProps } from "../../util/Modal";
import React from "react";
import { Organization, Pld, PldRevision, UpdatePldRevisionBody } from "@pld/shared";
import { Button, ButtonSet, Modal, MultiSelect, TextArea } from "carbon-components-react";
import { RequiredLabel } from "../../util/Label";

import {Renew} from '@carbon/icons-react';
import {Stack} from '@carbon/react';
import { PldApiController } from "../../controller/PldApiController";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hook/useAuth";
import { errorToast, successToast } from "../../manager/ToastManager";

type Props = {
  org: Organization;
  pld: Pld;
  revision: PldRevision;
} & ModalProps;

type Form = {
  comment: string;
  sections: string[];
}

export const EditRevisionPldModal = (props: Props) => {

  const {accessToken} = useAuth();
  const {getValues, watch, setValue, formState: {errors}} = useForm<Form>({defaultValues: {comment: props.revision.comments, sections: props.revision.sections}});

  const onClickUpdate = () => {
    const body: UpdatePldRevisionBody = new UpdatePldRevisionBody(getValues('comment') ?? '', getValues('sections'), props.revision.version);
    PldApiController.editRevision(accessToken, props.org._id, props.pld._id, body, (pld, error) => {
      if (error) {
        console.log(error)
        errorToast('Une erreur est survenue !');
      } else {
        successToast(`Révision ${props.revision.version} mise à jour`);
        props.onSuccess();
      }
    })
  }

  return (
    <Modal open={props.open} onRequestClose={props.onDismiss} passiveModal>
      <Stack gap={3}>
        <h3 style={{marginBottom: 18}}>Éditer la révision '{props.revision.version}'</h3>
        <TextArea id={'revision-comments'} labelText={"Commentaire"} value={watch('comment')} onChange={(e) => setValue('comment', e.currentTarget.value)}/>
        <MultiSelect
          label={watch('sections').length === 0 ? "Veuillez choisir la/les section(s) modifiée(s)" : watch('sections').join(', ')}
          titleText={<RequiredLabel message={"Sections modifiées"}/>}
          id="revision-section"
          selectedItems={watch('sections').map((a) => ({label: a}))}
          items={['Toutes', 'DoDs', 'Informations', 'Status'].map((e) => ({label: e}))}
          onChange={(e) => setValue('sections', e.selectedItems.map((a) => a.label))}
        />
        <ButtonSet style={{marginTop: 20}}>
          <Button onClick={onClickUpdate} iconDescription={'Mettre à jour'} renderIcon={Renew}>Mettre à jour</Button>
        </ButtonSet>
      </Stack>
    </Modal>
  )
};
