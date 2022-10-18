import React, { useEffect } from "react";
import { Button, Modal, TextInput } from "carbon-components-react";

import {Stack} from '@carbon/react';
import {Add} from '@carbon/icons-react';
import { OrganizationApiController } from "../../controller/OrganizationApiController";
import { Organization, OrganizationSectionBody } from "@pld/shared";
import { toast } from "react-toastify";
import { validate } from "class-validator";
import { RequiredLabel } from "../../util/Label";
import { ModalProps } from "../../util/Modal";
import { useAuth } from "../../hook/useAuth";
import { useForm } from "react-hook-form";

type Props = {
  org: Organization;
  section?: string;
} & ModalProps;

type Form = {
  name: string;
  section: string;
}

export const CreateOrgSectionModal = (props: Props) => {

  const {accessToken} = useAuth();
  const {getValues, setValue, watch} = useForm<Form>({defaultValues: {section: props.section ?? '', name: ''}});

  useEffect(() => init(), []);

  const init = () => {
    setValue('section', props.section ?? '');
  }

  const onClickCreate = (event: any) => {
    const body = new OrganizationSectionBody(getValues('section'), getValues('name'));
    validate(body).then((error) => {
/*      const obj: Error = {};
      error.forEach((err) => {
        obj[err.property] = Object.values(err.constraints ?? []).join(', ');
      });*/
      if (error.length === 0) {
        OrganizationApiController.createOrgSection(accessToken, props.org._id, body, (section, error) => {
          if (error) {
            toast(error.message, {type: 'error'});
          } else {
            props.onSuccess();
          }
        });
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
      modalHeading="Créer une section">
      <Stack gap={6}>
        <Stack gap={2}>
          <TextInput helperText={"la version doit être au format 'X.X' (X doit obligatoirement être un nombre)"} id={"section-input"} value={watch('section')} placeholder={"1.2"} labelText={<RequiredLabel message={"Section"}/>} onChange={(e) => setValue('section', e.currentTarget.value)}/>
          <TextInput helperText={"le nom doit contenir au minimum 3 caractères et maximum 64 caractères."} id={"name-input"}  value={watch('name')} placeholder={"Reflexion primaire"} labelText={<RequiredLabel message={"Nom"}/>} onChange={(e) => setValue('name', e.currentTarget.value)}/>
        </Stack>
        <Button renderIcon={Add} onClick={onClickCreate}>Créer</Button>
      </Stack>
    </Modal>
  )
};
