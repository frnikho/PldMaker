import { Button, TextInput } from "carbon-components-react";
import React from "react";
import { useForm } from "react-hook-form";
import { UserApiController } from "../../controller/UserApiController";
import { errorToast, successToast } from "../../manager/ToastManager";

import {Stack} from '@carbon/react';

import {Password} from '@carbon/icons-react';

type Form = {
  email: string;
}

export const ResetPasswordPage = () => {

  const {setValue, getValues, watch} = useForm<Form>({defaultValues: {email: ''}})

  const onClickReset = () => {
    UserApiController.sendChangePasswordLink(getValues(), (success, error) => {
      if (success) {
        successToast("Un email viens de vous être envoyer pour réinitialisé votre mot de passe");
      } else {
        errorToast("Une erreur est survenue lors de l'envoie du mail de réinitialisation du mot de passe");
      }
    })
  }

  return (
    <Stack gap={4}>
      <h1 style={{fontWeight: 'bold'}}>Mot de passe oublié</h1>
      <p>Si vous avez oublier/perdu votre mot de passe, vous pouvez le reinitialise en suivant les instructions envoyer dans le mail</p>
      <TextInput id={'reset-password-field'} labelText={"Adresse-email"} value={watch('email')} onChange={(e) => setValue('email', e.currentTarget.value)}/>
      <Button onClick={onClickReset} renderIcon={Password}>Reset password</Button>
    </Stack>
  );
};
