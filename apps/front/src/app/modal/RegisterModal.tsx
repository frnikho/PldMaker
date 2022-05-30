import React from "react";
import {
  Form,
  InlineLoading,
  Modal,
  TextInput
} from "carbon-components-react";
import {Stack} from '@carbon/react';
import {UserContext, UserContextProps} from "../context/UserContext";

type RegisterModalProps = {
  open: boolean;
  onDismiss: () => void;
}

type RegisterModalState = {
  email?: string;
  password?: string;
  verifiedPassword?: string;
  loading: boolean;
}

export class RegisterModal extends React.Component<RegisterModalProps, RegisterModalState> {

  constructor(props: RegisterModalProps) {
    super(props);
    this.state = {
      password: undefined,
      verifiedPassword: undefined,
      email: undefined,
      loading: false,
    }
    this.onClickRegister = this.onClickRegister.bind(this);
  }

  public onClickRegister(authContext: UserContextProps) {
    if (this.state.email === undefined || this.state.password === undefined || this.state.verifiedPassword === undefined)
      return;
    authContext.register(this.state.email, this.state.password).then((response) => {
      this.setState({
        loading: false,
      });
      if (response === null) {
        // TODO create notification error
      } else {
        console.log("Registered !");
      }
    });
    this.setState({loading: true});
  }

  override render() {
    return (
      <UserContext.Consumer>
        {(authContext) => {
          return <Modal
            open={this.props.open}
            onRequestClose={this.props.onDismiss}
            onRequestSubmit={() => this.onClickRegister(authContext)}
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
                <TextInput id="email" type={"email"} labelText="Adresse email" onChange={(event) => this.setState({email: event.target.value})}/>
                <TextInput id="mdp" type={"password"} labelText="Mot de passe" onChange={(event) => this.setState({password: event.target.value})}/>
                <TextInput id="verify_mdp" type={"password"} labelText="Retaper votre mot de passe" onChange={(event) => this.setState({verifiedPassword: event.target.value})}/>
              </Stack>
            </Form>
          </Modal>
        }}
      </UserContext.Consumer>
    );
  }

}
