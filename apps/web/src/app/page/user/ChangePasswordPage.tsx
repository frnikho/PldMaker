import { Button, ButtonSet, TextInput } from "carbon-components-react";
import { useAuth } from "../../hook/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";

import {Stack} from '@carbon/react';
import { UserApiController } from "../../controller/UserApiController";
import { UpdateUserPassword } from "@pld/shared";
import { useForm } from "react-hook-form";
import { successToast } from "../../manager/ToastManager";

type Form = {
  password: string;
}

export const ChangePasswordPage = () => {

  const [searchParams] = useSearchParams();
  const {logout} = useAuth();
  const navigate = useNavigate();
  const {getValues, setValue, watch} = useForm<Form>({defaultValues: {password: ''}});

  useEffect(() => {
    if (searchParams.get('token') === null || searchParams.get('email') === null) {
      navigate('/');
    }
  }, [searchParams]);

  const onChangePassword = () => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const body = new UpdateUserPassword(email!, token!, getValues('password'));
    UserApiController.changePassword(body, (user, error) => {
      console.log(user, error);
      if (user !== null) {
        logout();
        successToast('Votre mot de passe a été changé, reconnecter avec votre nouveau mot de passe');
        navigate('/');
      } else {
        console.log(error);
      }
    });
  }

  return (
    <>
      <h1 style={{marginBottom: 20}}>Changer votre mot de passe</h1>
      <Stack gap={4}>
        <TextInput id={'change-password-input'} value={watch('password')} onChange={(e) => setValue('password', e.currentTarget.value)} labelText={"Nouveau mot de passe"} helperText={"6 caractères minimum"}/>
        <ButtonSet>
          <Button kind={'ghost'} onClick={() => navigate('/profile')}>Annuler</Button>
          <Button onClick={onChangePassword}>Changer mon mot de passe</Button>
        </ButtonSet>
      </Stack>
    </>
  );
};
