import React, { useState } from "react";
import { Button, InlineLoading, Link, Modal, TextInput } from "carbon-components-react";
import { Stack } from "@carbon/react";
import { RequiredUserContextProps } from "../../context/UserContext";
import { LoginBody, User } from "@pld/shared";
import ErrorManager from "../../manager/ErrorManager";
import { toast } from "react-toastify";
import { validate } from "class-validator";
import { FieldData } from "../../util/FieldData";
import { ErrorType } from "../../util/Api";

import {Login} from '@carbon/icons-react';
import { useForm } from "react-hook-form";
import { useApiError } from "../../hook/useApiError";
import { useLanguage } from "../../hook/useLanguage";

type LoginModalProps = {
  open: boolean;
  onDismiss: () => void;
  onUserLogged: (user: User) => void;
  onRedirect: (path: string) => void;
  switchToRegister: () => void;
} & RequiredUserContextProps;

type LoginForm = {
  email: string;
  password: string;
}

export function LoginModal(props: LoginModalProps) {
  const { translate } = useLanguage();
  const { getError } = useApiError();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setError, reset, formState: { errors } } = useForm<LoginForm>();

  const onClickCreate = (form: LoginForm) => {
    const loginBody = new LoginBody(form.email, form.password, navigator.userAgent, navigator.platform, navigator.language);
    setLoading(true);
    validate(loginBody).then((errors) => {
      if (errors.length <= 0)
        return true;
      errors.forEach((error) => {
        const msg = Object.entries(error.constraints ?? {}).map((a) => a[1]);
        setError(error.property as keyof LoginForm, { message: msg.join(', ') });
      })
      return false;
    }).then((valid) => {
      if (!valid)
        return;
      props.userContext.login(loginBody, (user, error) => {
        if (error) {
          if (error.type === ErrorType.MFA_OTP_REQUIRED) {
            props.onDismiss();
            props.onRedirect('auth/otp');
            reset();
            return;
          }
          toast(ErrorManager.LoginError(error.statusCode ?? -1).message, { type: 'error' });
        } else if (user !== null) {
          props.onUserLogged(user);
          reset();
        }
      });
    }).then(() => {
      setLoading(false);
    });
  }

  return (<Modal
    passiveModal
    open={props.open}
    onRequestClose={props.onDismiss}
    modalHeading={translate('modals.login.title')}
    shouldSubmitOnEnter={true}
    size={"sm"}>
    <form onSubmit={handleSubmit(onClickCreate)}>
      <Stack gap={4}>
        <TextInput id="login-email" type={"email"} invalidText={errors.email?.message} invalid={errors.email !== undefined} labelText={translate('modals.login.forms.email')} {...register('email')} />
        <TextInput id="login-mdp" type={"password"} invalidText={errors.password?.message} invalid={errors.password !== undefined} labelText={translate('modals.login.forms.password')} {...register('password')} />
      </Stack>
      <br />
      <p><Link onClick={() => props.switchToRegister()}>{translate('modals.login.noAccount')}</Link></p>
      <Button type={"submit"} renderIcon={Login} style={{ marginTop: 18 }}>{translate('modals.login.login')}</Button>
    </form>
  </Modal>);

}
