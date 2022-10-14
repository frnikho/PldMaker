import { Button, Checkbox, Modal, ModalProps, TextInput } from "carbon-components-react";
import { RequiredUserContextProps } from "../../../context/UserContext";
import { RequiredLabel } from "../../../util/Label";
import { TwitterPicker } from "react-color";
import React, { useCallback, useState } from "react";

import {Stack} from '@carbon/react';
import {Add} from '@carbon/icons-react';
import { OrganizationApiController } from "../../../controller/OrganizationApiController";
import { NewDodStatus, Organization } from "@pld/shared";
import { DodStatusOperationType } from "../../../component/org/manage/ManageOrgDodStatusComponent";
import { toast } from "react-toastify";

export type CreateDodStatusProps = {
  org: Organization;
  onSuccess: (type: DodStatusOperationType) => void;
  onDismiss: () => void;
} & ModalProps & RequiredUserContextProps;

export type CreateDodStatusState = {
  name: string;
  color: string;
  useDefault: boolean;
}

export function CreateDodStatusModal(props: CreateDodStatusProps) {

  const [form, setForm] = useState<CreateDodStatusState>({color: '', useDefault: false, name: ''});

  const setFormField = useCallback((key: keyof CreateDodStatusState, value: unknown) => {
    setForm({...form, [key]: value});
  }, [form]);

  const onClickCreate = () => {
    const body = new NewDodStatus(form.name, form.color, form.useDefault);
    OrganizationApiController.createOrgDodStatus(props.userContext.accessToken, props.org._id, body, (dodStatus, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      } else {
        props.onSuccess(DodStatusOperationType.Created);
      }
    })
  }

  return (
    <Modal open={props.open} onRequestClose={props.onDismiss} passiveModal>
      <Stack gap={6}>
        <h3 >Créer un nouveau statut</h3>
        <TextInput helperText={"le statut doit contenir au minimum 2 caractères et maximum 32 caractères"} maxLength={32} minLength={2} id={'status-name-input'} labelText={<RequiredLabel message={"Status"}/>} value={form.name} onChange={(e) => setFormField('name', e.currentTarget.value)}/>
        <Checkbox title={"Utiliser ce statut par défaut lors de la création de nouvelle DoDs ?"} labelText={'Utiliser par défaut'} id="checkbox-label-1" checked={form.useDefault} onChange={(e, {checked, id}) => setFormField('useDefault', checked)}/>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <TwitterPicker triangle={'hide'} onChangeComplete={(color) => {
            setFormField('color', color.hex.slice(1, 7));
          }} color={`#${form.color}`}/>
          <div title={"Couleur du statut"} className="square" style={{
            height: '40px',
            width: '40px',
            marginLeft: 18,
            backgroundColor: `#${form.color}`,
            borderRadius: '50%',
            display: 'inline-block',
          }}/>
        </div>
        <Button onClick={onClickCreate} renderIcon={Add}>Créer</Button>
      </Stack>
    </Modal>
  );

}
