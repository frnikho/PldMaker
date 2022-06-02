import React from "react";
import {
  Form,
  InlineLoading,
  Modal,
  TextInput
} from "carbon-components-react";
import {Stack} from '@carbon/react';

type LoginModalProps = {
  open: boolean;
  onDismiss: () => void;
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

  public onClickCreate() {
    console.log(this.state);
    this.setState({loading: true});
  }

  override render() {
    return (
      <Modal
        open={this.props.open}
        onRequestClose={this.props.onDismiss}
        onRequestSubmit={this.onClickCreate}
        modalHeading="Se connecter"
        modalLabel="Login"
        shouldSubmitOnEnter={true}
        primaryButtonText={this.state.loading ? <InlineLoading
          description={"abc ..."}
          status={this.state.loading ? 'active' : 'finished'}/> : "Créer mon compte"}
        primaryButtonDisabled={this.state.loading}
        secondaryButtonText="Annuler"
        size={"md"}>
        <Form>
          <Stack gap={7}>
            <TextInput id="email" type={"email"} labelText="Adresse email" onChange={(event) => this.setState({email: event.target.value})}/>
            <TextInput id="mdp" type={"password"} labelText="Mot de passe" onChange={(event) => this.setState({password: event.target.value})}/>
          </Stack>
        </Form>
      </Modal>
    );
  }

}
