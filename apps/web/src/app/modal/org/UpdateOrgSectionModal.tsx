import React, { useEffect } from "react";
import { Button, ButtonSet, Modal, TextInput } from "carbon-components-react";

import {Stack} from '@carbon/react';
import { OrganizationApiController } from "../../controller/OrganizationApiController";
import { Organization, OrganizationSection, OrganizationSectionUpdateBody } from "@pld/shared";
import { toast } from "react-toastify";

import {TrashCan, Renew} from '@carbon/icons-react';
import { ModalProps } from "../../util/Modal";
import { useAuth } from "../../hook/useAuth";
import { useForm } from "react-hook-form";

type Props = {
  section: OrganizationSection;
  org: Organization;
} & ModalProps;

type Form = {
  section: string,
  name: string;
}

export const UpdateOrgSectionModal = (props: Props) => {

  const {accessToken} = useAuth();
  const {getValues, setValue, watch} = useForm<Form>();

  useEffect(() => init(), []);

  const init = () => {
    setValue('section', props.section.section);
    setValue('name', props.section.name);
  }

  const onClickDelete = () => {
    OrganizationApiController.deleteOrgSection(accessToken, props.org._id, props.section._id, (section, error) => {
      if (error) {
        toast(error.message[0], {type: 'error'});
      } else {
        props.onSuccess();
      }
    });
  }

  const onClickUpdate = (event: any) => {
    const body = new OrganizationSectionUpdateBody(getValues('name'));
    OrganizationApiController.updateOrgSection(accessToken, props.org._id, props.section._id, body, (section, error) => {
      if (error) {
        toast(error.message[0], {type: 'error'});
      } else {
        props.onSuccess();
      }
    });
  }

  return (
    <Modal
      size={"sm"}
      open={props.open}
      onRequestClose={props.onDismiss}
      onRequestSubmit={props.onSuccess}
      passiveModal
      modalHeading={`Mettre à jour la section ${props.section.section}`}>
      <form>
        <Stack gap={3}>
          <TextInput disabled id={"section-input"} value={watch('section')} placeholder={"1.2"} labelText={"Section"}/>
          <TextInput id={"name-input"} placeholder={"User"} labelText={"Nom"} value={watch('name')} onChange={(e) => setValue('name', e.currentTarget.value)}/>
          <ButtonSet style={{marginTop: 20}}>
            <Button onClick={onClickDelete} kind={'danger'} iconDescription={'Supprimer'} renderIcon={TrashCan}>Supprimer</Button>
            <Button onClick={onClickUpdate} iconDescription={'Mettre à jour'} renderIcon={Renew}>Mettre à jour</Button>
          </ButtonSet>
        </Stack>
      </form>
    </Modal>
  )
};
