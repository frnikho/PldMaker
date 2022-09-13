import React from "react";
import {
  InlineLoading, Link,
  Modal,
  TextInput
} from "carbon-components-react";
import {Stack} from '@carbon/react';
import {RequiredUserContextProps, UserContextProps} from "../../context/UserContext";
import {FieldData} from "../../util/FieldData";
import {toast} from "react-toastify";
import {validate} from "class-validator";
import {ReactFormValidation} from "../../util/Page";
import {RegisterBody, User} from "@pld/shared";

type RegisterModalProps = {
  open: boolean;
  onDismiss: () => void;
  onRegister: (user: User) => void;
  switchToRegister: () => void;
} & RequiredUserContextProps

type RegisterModalState = {
  email: FieldData<string>;
  password: FieldData<string>;
  firstname: FieldData<string>;
  lastname: FieldData<string>;
  loading: boolean;
}

export class RegisterModal extends ReactFormValidation<RegisterModalProps, RegisterModalState> {

  constructor(props: RegisterModalProps) {
    super(props);
    this.state = {
      password: {
        value: ''
      },
      email: {
        value: ''
      },
      firstname: {
        value: ''
      },
      lastname: {
        value: '',
      },
      loading: false,
    }
    this.onClickRegister = this.onClickRegister.bind(this);
  }

  public onClickRegister(authContext: UserContextProps) {
    const registerBody = new RegisterBody(this.state.email.value, this.state.password.value, this.state.firstname.value, this.state.lastname.value);
    this.setState({loading: true});
    validate(registerBody).then((errors) => {
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
      authContext.register(registerBody, (user, error) => {
        if (error) {
          toast(error.message, {type: 'error'});
        }
        if (user !== null) {
          this.props.onRegister(user);
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
      onRequestSubmit={(e) => {
        if (e.type === 'keydown')
          return;
        this.onClickRegister(this.props.userContext);
      }}
      modalHeading={'Créer un compte'}
      shouldSubmitOnEnter={true}
      primaryButtonText={this.state.loading ? <InlineLoading
        description={"Chargement ..."}
        status={this.state.loading ? 'active' : 'finished'}/> : "Créer mon compte"}
      primaryButtonDisabled={this.state.loading}
      secondaryButtonText="Annuler"
      size={"md"}>
        <Stack gap={4}>
          <TextInput id="register-email" type={"email"} labelText="Adresse email"
                     invalid={this.state.email.error !== undefined}
                     invalidText={this.state.email.error}
                     onKeyPress={(e) => {
                       const form = e.target;
                       console.log(form);
                     }}
                     onChange={(event) => this.setState({email: {value: event.target.value}})}/>
          <TextInput.PasswordInput id="register-mdp"
                                   invalid={this.state.password.error !== undefined}
                                   invalidText={this.state.password.error}
                                   type={"password"} labelText="Mot de passe"
                                   onChange={(event) => this.setState({password: {value: event.target.value}})}/>
          <TextInput id={"lastname"} labelText={"Nom"}
                     invalid={this.state.lastname.error !== undefined}
                     invalidText={this.state.lastname.error}
                     onChange={(event) => this.setState({lastname: {value: event.target.value}})}/>
          <TextInput id={"firstname"} labelText={"Prénom"}
                     invalid={this.state.firstname.error !== undefined}
                     invalidText={this.state.firstname.error}
                     onChange={(event) => this.setState({firstname: {value: event.target.value}})}/>
        </Stack>
      <br/>
      <br/>
      Vous avez deja un compte ? <Link onClick={() => this.props.switchToRegister()}>connectez vous ici !</Link>
    </Modal>);
  }

}
