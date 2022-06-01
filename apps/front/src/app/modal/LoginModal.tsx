import React from "react";
import {
  Form,
  InlineLoading, Link,
  Modal,
  TextInput, Tile
} from "carbon-components-react";
import {Stack} from '@carbon/react';
import {UserContext, UserContextProps} from "../context/UserContext";
import {User} from "../../../../../libs/data-access/user/User";

type LoginModalProps = {
  open: boolean;
  onDismiss: () => void;
  onUserLogged: (user: User) => void;
  switchToRegister: () => void;
}

type LoginModalState = {
  email?: string;
  password?: string;
  loading: boolean;
}

export class LoginModal extends React.Component<LoginModalProps, LoginModalState> {

  constructor(props: LoginModalProps) {
    super(props);
    this.state = {
      password: undefined,
      email: undefined,
      loading: false,
    }
    this.onClickCreate = this.onClickCreate.bind(this);
  }

  public onClickCreate(authContext: UserContextProps) {
    if (this.state.email === undefined || this.state.password === undefined)
      return;
    this.setState({loading: true});
    authContext.login(this.state.email, this.state.password, (user, error) => {
      this.setState({
        loading: false,
      });
      if (user !== null && error === undefined) {
        this.props.onUserLogged(user);
      } else {
        // TODO create notification error
        console.log("Error login: ", error);
      }
    });

  }

  override render() {
    return (
      <UserContext.Consumer>
        {(authContext) => {
          return <Modal
            open={this.props.open}
            onRequestClose={this.props.onDismiss}
            onRequestSubmit={() => this.onClickCreate(authContext)}
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
                <TextInput id="email" type={"email"} labelText="Adresse email" onChange={(event) => this.setState({email: event.target.value})}/>
                <TextInput id="mdp" type={"password"} labelText="Mot de passe" onChange={(event) => this.setState({password: event.target.value})}/>
              </Stack>
            </Form>
            <br />
            <br />
            Pas encore de compte ? <Link onClick={() => this.props.switchToRegister()}>Inscrivez vous ici !</Link>
          </Modal>
        }}
      </UserContext.Consumer>
    );
  }

}
