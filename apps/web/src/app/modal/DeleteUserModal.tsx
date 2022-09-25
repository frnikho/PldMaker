import { ModalComponent } from "../util/Modal";
import { Button, TextInput } from "carbon-components-react";

import {Stack} from '@carbon/react';
import {TrashCan} from '@carbon/icons-react';
import { RequiredUserContextProps } from "../context/UserContext";
import { UserApiController } from "../controller/UserApiController";
import { toast } from "react-toastify";

export type DeleteUserModalProps = {

} & RequiredUserContextProps;

export type DeleteUserModalState = {
  email: string;
}

export class DeleteUserModal extends ModalComponent<DeleteUserModalProps, DeleteUserModalState> {

  constructor(props) {
    super(props, {passiveModal: true});
    this.state = {
      email: '',
    }
    this.onClickDeleted = this.onClickDeleted.bind(this);
  }

  private onClickDeleted() {
    UserApiController.deleteUser(this.props.userContext.accessToken, (user, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      } else {
        //this.props.userContext.logout();
        this.props.onSuccess();
      }
    })
  }

  override renderModal(): React.ReactNode {
    return (
      <Stack gap={4}>
        <h3>Supprimer votre compte</h3>
        <TextInput id={'user-email-delete-input'} labelText={"Adresse email"} value={this.state.email} onChange={(a) => this.setState({email: a.currentTarget.value})}/>
        <Button disabled={this.state.email !== this.props.userContext.user?.email} kind={'danger'} renderIcon={TrashCan} onClick={this.onClickDeleted}>Supprimer</Button>
      </Stack>
    )
  }

}
