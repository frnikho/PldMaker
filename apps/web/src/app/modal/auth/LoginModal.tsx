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
import { useSearchParams } from "react-router-dom";

type LoginModalProps = {
  open: boolean;
  onDismiss: () => void;
  onUserLogged: (user: User) => void;
  onRedirect: (path: string) => void;
  switchToRegister: () => void;
} & RequiredUserContextProps;

type LoginModalState = {
  email: FieldData<string>;
  password: FieldData<string>;
  loading: boolean;
}

type LoginForm = {
  email: string;
  password: string;
}

export function LoginModal(props: LoginModalProps) {
  const [loading, setLoading] = useState(false);
  const {
    register, handleSubmit, watch, setError, reset, formState: {errors}
  } = useForm<LoginForm>();
  const [searchParams, setSearchParams] = useSearchParams();

  const onClickCreate = (form: LoginForm) => {
    const loginBody = new LoginBody(form.email, form.password, navigator.userAgent, navigator.platform, navigator.language);
    setLoading(true);
    validate(loginBody).then((errors) => {
      if (errors.length <= 0)
        return true;
      errors.forEach((error) => {
        const msg = Object.entries(error.constraints ?? {}).map((a) => a[1]);
        setError(error.property as keyof LoginForm, {message: msg.join(', ')});
      })
      return false;
    }).then((valid) => {
      if (!valid)
        return;
      props.userContext.login(loginBody, (user, error) => {
        if (error) {
          if (error.type === ErrorType.MFA_OTP_REQUIRED) {
            props.onRedirect('auth/otp');
            props.onDismiss();
            reset();
            return;
          }
          toast(ErrorManager.LoginError(error.statusCode ?? -1).message, {type: 'error'});
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
    modalHeading={'Se connecter'}
    shouldSubmitOnEnter={true}
    primaryButtonText={loading ? <InlineLoading
      description={"Chargement ..."}
      status={loading ? 'active' : 'finished'}/> : "Connexion"}
    primaryButtonDisabled={loading}
    secondaryButtonText="Annuler"
    size={"sm"}>
    <form onSubmit={handleSubmit(onClickCreate)}>
      <Stack gap={4}>
        <TextInput id="login-email" type={"email"} invalidText={errors.email?.message} invalid={errors.email !== undefined} labelText="Adresse email" {...register('email')}/>
        <TextInput id="login-mdp" type={"password"} invalidText={errors.password?.message} invalid={errors.password !== undefined} labelText="Mot de passe" {...register('password')}/>
      </Stack>
      <br />
      <p>Pas encore de compte ? <Link onClick={() => props.switchToRegister()}>Inscrivez vous ici !</Link></p>
      <Button type={"submit"} renderIcon={Login} style={{marginTop: 18}}>Se connecter</Button>
    </form>
  </Modal>);

}
/*
export class LoginModal extends ReactFormValidation<LoginModalProps, LoginModalState> {

  constructor(props: LoginModalProps) {
    super(props);
    this.state = {
      password: {
        value: ''
      },
      email: {
        value: ''
      },
      loading: false,
    }
    this.onClickCreate = this.onClickCreate.bind(this);
  }

  private resetFields() {
    this.setState({
      email: {
        value: '',
      },
      password: {
        value: ''
      }
    })
  }

  public onClickCreate(authContext: UserContextProps) {
    const loginBody = new LoginBody(this.state.email.value, this.state.password.value, navigator.userAgent, navigator.platform, navigator.language);
    this.setState({loading: true});
    validate(loginBody).then((errors) => {
      if (errors.length <= 0)
        return true;
      errors.forEach((error) => {
        const msg = Object.entries(error.constraints ?? {}).map((a) => a[1]);
        this.updateFormField(error.property, '', msg.join(', '));
      })
      return false;
    }).then((valid) => {
      if (!valid)
        return;
      authContext.login(loginBody, (user, error) => {
        if (error) {
          if (error.type === ErrorType.MFA_OTP_REQUIRED) {
            this.props.onRedirect('auth/otp');
            this.props.onDismiss();
            this.resetFields();
            return;
          }
          toast(ErrorManager.LoginError(error.statusCode ?? -1).message, {type: 'error'});
        } else if (user !== null) {
          this.props.onUserLogged(user);
          this.resetFields();
        }
      });
    }).then(() => {
      this.setState({loading: false})
    });
  }

  override render() {
    return (<Modal
      passiveModal
      open={this.props.open}
      onRequestClose={this.props.onDismiss}
      modalHeading={'Se connecter'}
      shouldSubmitOnEnter={true}
      primaryButtonText={this.state.loading ? <InlineLoading
        description={"Chargement ..."}
        status={this.state.loading ? 'active' : 'finished'}/> : "Connexion"}
      primaryButtonDisabled={this.state.loading}
      secondaryButtonText="Annuler"
      size={"sm"}>
        <Stack gap={4}>
          <TextInput id="login-email" type={"email"} invalidText={this.state.email.error} invalid={this.state.email.error !== undefined} labelText="Adresse email" onChange={(event) => this.setState({email: {
            value: event.target.value
            }})}/>
          <TextInput id="login-mdp" type={"password"} invalidText={this.state.password.error} invalid={this.state.password.error !== undefined} labelText="Mot de passe" onChange={(event) => this.setState({password: {
            value: event.target.value}
          })}/>
        </Stack>
        <br />
        <p>Pas encore de compte ? <Link onClick={() => this.props.switchToRegister()}>Inscrivez vous ici !</Link></p>
        <Button renderIcon={Login} style={{marginTop: 18}} onClick={() => this.onClickCreate(this.props.userContext)}>Se connecter</Button>
    </Modal>);
  }

}*/
