import React from "react";
import {
  Form,
  InlineLoading, Link,
  Modal,
  TextInput,
} from "carbon-components-react";
import {Stack} from '@carbon/react';
import {RequiredUserContextProps, UserContextProps} from "../context/UserContext";
import {User} from "../../../../../libs/data-access/user/User";
import ErrorManager from "../manager/ErrorManager";
import {toast} from "react-toastify";
import {LoginBody} from "../../../../../libs/data-access/auth/LoginBody";
import {validate} from "class-validator";
import {FieldData} from "../util/FieldData";
import {ReactPage} from "../util/Page";

type LoginModalProps = {
  open: boolean;
  onDismiss: () => void;
  onUserLogged: (user: User) => void;
  switchToRegister: () => void;
} & RequiredUserContextProps;

type LoginModalState = {
  email: FieldData<string>;
  password: FieldData<string>;
  loading: boolean;
}

export class LoginModal extends ReactPage<LoginModalProps, LoginModalState> {

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
    if (this.state.email === undefined || this.state.password === undefined)
      return;
    const loginBody = new LoginBody(this.state.email.value, this.state.password.value);
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
        modalHeading="Se connecter"
        modalLabel="Login"
        shouldSubmitOnEnter={true}
        primaryButtonText={this.state.loading ? <InlineLoading
          description={"Chargement ..."}
          status={this.state.loading ? 'active' : 'finished'}/> : "Connexion"}
        primaryButtonDisabled={this.state.loading}
        secondaryButtonText="Annuler"
        size={"md"}>
        <Form>
          <Stack gap={7}>
            <TextInput id="email" type={"email"} invalidText={this.state.email.error} invalid={this.state.email.error !== undefined} labelText="Adresse email" onChange={(event) => this.setState({email: {
              value: event.target.value
              }})}/>
            <TextInput id="mdp" type={"password"} invalidText={this.state.password.error} invalid={this.state.password.error !== undefined} labelText="Mot de passe" onChange={(event) => this.setState({password: {
              value: event.target.value}
            })}/>
          </Stack>
        </Form>
        <br />
        <br />
        Pas encore de compte ? <Link onClick={() => this.props.switchToRegister()}>Inscrivez vous ici !</Link>
      </Modal>);
  }

}
