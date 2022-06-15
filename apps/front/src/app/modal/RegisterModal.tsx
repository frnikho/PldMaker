import React from "react";
import {
  Form,
  InlineLoading, Link,
  Modal,
  TextInput
} from "carbon-components-react";
import {Stack} from '@carbon/react';
import {RequiredUserContextProps, UserContextProps} from "../context/UserContext";
import {User} from "../../../../../libs/data-access/user/User";
import {FieldData} from "../util/FieldData";
import {toast} from "react-toastify";

type RegisterModalProps = {
  open: boolean;
  onDismiss: () => void;
  onRegister: (user: User) => void;
  switchToRegister: () => void;
} & RequiredUserContextProps

type RegisterModalState = {
  email: FieldData<string>;
  password: FieldData<string>;
  verifiedPassword: FieldData<string>;
  loading: boolean;
}



export class RegisterModal extends React.Component<RegisterModalProps, RegisterModalState> {

  constructor(props: RegisterModalProps) {
    super(props);
    this.state = {
      password: {
        value: ''
      },
      verifiedPassword: {
        value: ''
      },
      email: {
        value: ''
      },
      loading: false,
    }
    this.onClickRegister = this.onClickRegister.bind(this);
  }

  public onClickRegister(authContext: UserContextProps) {
    if (this.state.email.value === undefined || this.state.password.value === undefined || this.state.verifiedPassword.value === undefined)
      return;
    this.setState({loading: true});
    authContext.register(this.state.email.value, this.state.password.value, (user, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      }
      if (user !== null) {
        this.props.onRegister(user);
      }
    });
  }

  override render() {
    return (<Modal
      open={this.props.open}
      onRequestClose={this.props.onDismiss}
      onRequestSubmit={() => this.onClickRegister(this.props.userContext)}
      modalHeading="Créer un compte"
      modalLabel="Register"
      shouldSubmitOnEnter={true}
      primaryButtonText={this.state.loading ? <InlineLoading
        description={"Chargement ..."}
        status={this.state.loading ? 'active' : 'finished'}/> : "Créer mon compte"}
      primaryButtonDisabled={this.state.loading}
      secondaryButtonText="Annuler"
      size={"md"}>
      <Form>
        <Stack gap={7}>
          <TextInput id="email" type={"email"} labelText="Adresse email"
                     onChange={(event) => this.setState({email: {value: event.target.value}})}/>
          <TextInput.PasswordInput id="mdp" type={"password"} labelText="Mot de passe"
                                   onChange={(event) => this.setState({password: {value: event.target.value}})}/>
          <TextInput.PasswordInput id="verify_mdp" type={"password"} labelText="Retaper votre mot de passe"
                                   onChange={(event) => this.setState({verifiedPassword: {value: event.target.value}})}/>
        </Stack>
      </Form>
      <br/>
      <br/>
      Vous avez deja un compte ? <Link onClick={() => this.props.switchToRegister()}>connectez vous ici !</Link>
    </Modal>);
  }

}
