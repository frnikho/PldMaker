import React from "react";
import { InlineLoading, Link, Modal, TextInput } from "carbon-components-react";
import { Stack } from "@carbon/react";
import { RequiredUserContextProps, UserContextProps } from "../../context/UserContext";
import { LoginBody, User } from "@pld/shared";
import ErrorManager from "../../manager/ErrorManager";
import { toast } from "react-toastify";
import { validate } from "class-validator";
import { FieldData } from "../../util/FieldData";
import { ReactFormValidation } from "../../util/Page";
import { ErrorType } from "../../util/Api";

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
          }
          toast(ErrorManager.LoginError(error.statusCode ?? -1).message, {type: 'error'});
        } else if (user !== null) {
          this.props.onUserLogged(user);
        }
      });
    }).then(() => {
      this.setState({loading: false})
    });
  }

  override render() {
      return (<Modal
        open={this.props.open}
        onRequestClose={this.props.onDismiss}
        onRequestSubmit={() => this.onClickCreate(this.props.userContext)}
        modalHeading={'Se connecter'}
        shouldSubmitOnEnter={true}
        primaryButtonText={this.state.loading ? <InlineLoading
          description={"Chargement ..."}
          status={this.state.loading ? 'active' : 'finished'}/> : "Connexion"}
        primaryButtonDisabled={this.state.loading}
        secondaryButtonText="Annuler"
        size={"md"}>
          <Stack gap={4}>
            <TextInput id="login-email" type={"email"} invalidText={this.state.email.error} invalid={this.state.email.error !== undefined} labelText="Adresse email" onChange={(event) => this.setState({email: {
              value: event.target.value
              }})}/>
            <TextInput id="login-mdp" type={"password"} invalidText={this.state.password.error} invalid={this.state.password.error !== undefined} labelText="Mot de passe" onChange={(event) => this.setState({password: {
              value: event.target.value}
            })}/>
          </Stack>
        <br />
        <br />
        Pas encore de compte ? <Link onClick={() => this.props.switchToRegister()}>Inscrivez vous ici !</Link>
      </Modal>);
  }

}
