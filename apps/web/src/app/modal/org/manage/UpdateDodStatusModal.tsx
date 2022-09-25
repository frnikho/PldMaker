import { ModalComponent, ModalComponentProps } from "../../../util/Modal";
import { Button, ButtonSet, Checkbox, TextInput } from "carbon-components-react";
import { RequiredUserContextProps } from "../../../context/UserContext";
import { OrganizationApiController } from "../../../controller/OrganizationApiController";
import { DodStatus, Organization, UpdateDodStatus } from "@pld/shared";
import { toast } from "react-toastify";
import { DodStatusOperationType } from "../../../component/org/manage/ManageOrgDodStatusComponent";
import { TwitterPicker } from "react-color";
import React from "react";

import {Stack} from '@carbon/react';
import { RequiredLabel } from "../../../util/Label";

import {Add, TrashCan} from '@carbon/icons-react';

export type UpdateDodStatusProps = {
  selectedDodStatus: DodStatus;
  org: Organization;
} & ModalComponentProps & RequiredUserContextProps;

export type UpdateDodStatusState = {
  name: string;
  color: string;
  useDefault: boolean;
}

export class UpdateDodStatusModal extends ModalComponent<UpdateDodStatusProps, UpdateDodStatusState> {

  constructor(props) {
    super(props, {passiveModal: true});
    this.state = {
      color: '',
      name: '',
      useDefault: false,
    }
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onClickUpdate = this.onClickUpdate.bind(this);
  }

  protected override onOpen() {
    this.setState({
      name: this.props.selectedDodStatus.name,
      color: this.props.selectedDodStatus.color,
      useDefault: this.props.selectedDodStatus.useDefault,
    })
  }

  private onClickDelete() {
    OrganizationApiController.deleteOrgDodStatus(this.props.userContext.accessToken, this.props.org._id, this.props.selectedDodStatus._id, (dodStatus, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      } else {
        this.props.onSuccess(DodStatusOperationType.Deleted);
      }
    });
  }

  private onClickUpdate() {
    const body = new UpdateDodStatus(this.state.name, this.state.color, this.state.useDefault);
    OrganizationApiController.updateOrgDodStatus(this.props.userContext.accessToken, this.props.org._id, this.props.selectedDodStatus._id, body, (dodStatus, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      } else {
        this.props.onSuccess(DodStatusOperationType.Updated);
      }
    });
  }

  override renderModal(): React.ReactNode {
    return (<Stack gap={6}>
      <h3 >Mettre à jour le statut</h3>
      <TextInput maxLength={32} minLength={2} id={'status-name-input'} labelText={<RequiredLabel message={"Status"}/>} value={this.state.name} onChange={(e) => this.setState({name: e.currentTarget.value})}/>
      <Checkbox labelText={'Utiliser par défaut'} id="defaultValue" checked={this.state.useDefault} onChange={(e, {checked, id}) => this.setState({useDefault: checked})}/>
      <TwitterPicker triangle={'hide'} onChangeComplete={(color) => {
        console.log(color.hex.slice(1, 7));
        this.setState({color: color.hex.slice(1, 7)})
      }} color={`#${this.state.color}`}/>
      <div>
        <div className="square" style={{
          height: '40px',
          width: '40px',
          marginRight: 10,
          backgroundColor: `#${this.state.color}`,
          borderRadius: '50%',
          display: 'inline-block',
        }}/>
      </div>
      <ButtonSet>
        <Button disabled={this.props.selectedDodStatus.useDefault} title={'Ce status est utilisé par défaut'} onClick={this.onClickDelete} kind={'danger'} renderIcon={TrashCan}>Supprimer</Button>
        <Button onClick={this.onClickUpdate} renderIcon={Add}>Mettre à jour</Button>
      </ButtonSet>
    </Stack>);
  }

}
