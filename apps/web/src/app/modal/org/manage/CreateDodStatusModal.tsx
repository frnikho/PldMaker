import { ModalComponent } from "../../../util/Modal";
import { Button, ButtonSet, Checkbox, ModalProps, TextInput } from "carbon-components-react";
import { RequiredUserContextProps } from "../../../context/UserContext";
import { RequiredLabel } from "../../../util/Label";
import { TwitterPicker } from "react-color";
import React from "react";

import {Stack} from '@carbon/react';
import {Add} from '@carbon/icons-react';
import { OrganizationApiController } from "../../../controller/OrganizationApiController";
import { NewDodStatus, Organization } from "@pld/shared";
import { DodStatusOperationType } from "../../../component/org/manage/ManageOrgDodStatusComponent";
import { toast } from "react-toastify";

export type CreateDodStatusProps = {
  org: Organization;
} & ModalProps & RequiredUserContextProps;

export type CreateDodStatusState = {
  name: string;
  color: string;
  useDefault: boolean;
}

export class CreateDodStatusModal extends ModalComponent<CreateDodStatusProps, CreateDodStatusState> {

  constructor(props) {
    super(props, {passiveModal: true, size: 'sm'});
    this.state = {
      color: '',
      name: '',
      useDefault: false,
    }
    this.onClickCreate = this.onClickCreate.bind(this);
  }

  private onClickCreate() {
    const body = new NewDodStatus(this.state.name, this.state.color, this.state.useDefault);
    OrganizationApiController.createOrgDodStatus(this.props.userContext.accessToken, this.props.org._id, body, (dodStatus, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      } else {
        this.props.onSuccess(DodStatusOperationType.Created);
      }
    })
  }

  override renderModal(): React.ReactNode {
    return (<Stack gap={6}>
      <h3 >Créer un nouveau statut</h3>
      <TextInput helperText={"le statut doit contenir au minimum 2 caractères et maximum 32 caractères"} maxLength={32} minLength={2} id={'status-name-input'} labelText={<RequiredLabel message={"Status"}/>} value={this.state.name} onChange={(e) => this.setState({name: e.currentTarget.value})}/>
      <Checkbox title={"Utiliser ce statut par défaut lors de la création de nouvelle DoDs ?"} labelText={'Utiliser par défaut'} id="checkbox-label-1" checked={this.state.useDefault} onChange={(e, {checked, id}) => this.setState({useDefault: checked})}/>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <TwitterPicker triangle={'hide'} onChangeComplete={(color) => {
          console.log(color.hex.slice(1, 7));
          this.setState({color: color.hex.slice(1, 7)})
        }} color={`#${this.state.color}`}/>
        <div title={"Couleur du statut"} className="square" style={{
          height: '40px',
          width: '40px',
          marginLeft: 18,
          backgroundColor: `#${this.state.color}`,
          borderRadius: '50%',
          display: 'inline-block',
        }}/>
      </div>
      <Button onClick={this.onClickCreate} renderIcon={Add}>Créer</Button>
    </Stack>);
  }

}
