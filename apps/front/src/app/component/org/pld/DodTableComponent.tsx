import React from "react";
import {RequiredUserContextProps} from "../../../context/UserContext";
import {Button} from "carbon-components-react";

import {Add} from '@carbon/icons-react';
import {NewDodModal} from "../../../modal/pld/NewDodModal";
import {Dod} from "../../../../../../../libs/data-access/pld/dod/Dod";

export type DodTableComponentProps = {
  onUpdateDod: () => void;
  onCreatedDod: () => void;
  onDeleteDod: () => void;

} & RequiredUserContextProps

export type DodTableComponentState = {
  openCreateModal: boolean;
}

export class DodTableComponent extends React.Component<DodTableComponentProps, DodTableComponentState> {

  constructor(props) {
    super(props);
    this.state = {
      openCreateModal: false,
    }
    this.onClickCreateDod = this.onClickCreateDod.bind(this);
    this.onDismissDodModal = this.onDismissDodModal.bind(this);
    this.onCreateDod = this.onCreateDod.bind(this);
  }

  override componentDidMount() {

  }

  private onClickCreateDod() {
    this.setState({
      openCreateModal: true,
    });

  }

  private onDismissDodModal() {
    this.setState({
      openCreateModal: false,
    });
  }

  private onCreateDod(newDod: Dod) {
    console.log(newDod);
  }

  override render() {
    return (
      <>
        <NewDodModal open={this.state.openCreateModal} onDismiss={this.onDismissDodModal} onCreatedDod={this.onCreateDod} lastDod={[]}/>
        <Button iconDescription={"Créer un nouveau"} renderIcon={Add} onClick={this.onClickCreateDod}>Créer un nouveau Dod</Button>
      </>
    );
  }

}
