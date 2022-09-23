import { ModalComponent } from "../../util/Modal";
import React from "react";
import { Organization, Pld, PldRevision, UpdatePldRevisionBody } from "@pld/shared";
import { Button, ButtonSet, MultiSelect, TextArea } from "carbon-components-react";
import { RequiredLabel } from "../../util/Label";

import {Renew} from '@carbon/icons-react';
import {Stack} from '@carbon/react';
import { PldApiController } from "../../controller/PldApiController";
import { RequiredUserContextProps } from "../../context/UserContext";
import { toast } from "react-toastify";

export type EditRevisionPldModalProps = {
  org: Organization;
  pld: Pld;
  revision: PldRevision;
} & RequiredUserContextProps;

export type EditRevisionPldModalState = {
  comments: string | undefined;
  sections: string[];
}

export class EditRevisionPldModal extends ModalComponent<EditRevisionPldModalProps, EditRevisionPldModalState> {

  constructor(props) {
    super(props, {size: 'md', passiveModal: true});
    this.state = {
      sections: this.props.revision.sections,
      comments: this.props.revision.comments,
    }
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onClickUpdate = this.onClickUpdate.bind(this);
  }

  protected override onOpen() {
    this.setState({
      sections: this.props.revision.sections,
      comments: this.props.revision.comments,
    })
  }

  private onClickDelete() {

  }

  private onClickUpdate() {
    const body: UpdatePldRevisionBody = new UpdatePldRevisionBody(this.state.comments ?? '', this.state.sections, this.props.revision.version);
    PldApiController.editRevision(this.props.userContext.accessToken, this.props.org._id, this.props.pld._id, body, (pld, error) => {
      if (error) {
        console.log(error)
        toast('Error', {type: 'error'});
      } else {
        toast(`Section ${this.props.revision.version} mis à jour`, {type: 'success'})
        this.props.onSuccess();
      }
    })
  }

  renderModal(): React.ReactNode {
    return (
      <Stack gap={3}>
        <h3 style={{marginBottom: 18}}>Éditer la révision '{this.props.revision.version}'</h3>
        <TextArea id={'revision-comments'} labelText={"Commentaire"} value={this.state.comments} onChange={(e) => this.setState({comments: e.currentTarget.value})}/>
        <MultiSelect
          label={this.state.sections.length === 0 ? "Veuillez choisir la/les section(s) modifiée(s)" : this.state.sections.join(', ')}
          titleText={<RequiredLabel message={"Sections modifiées"}/>}
          id="revision-section"
          selectedItems={this.state.sections.map((a) => ({label: a}))}
          items={['Toutes', 'DoDs', 'Informations', 'Status'].map((e) => ({label: e}))}
          onChange={(e) => {
            this.setState({
              sections: e.selectedItems.map((a) => a.label)
            })
          }}
        />
        <ButtonSet style={{marginTop: 20}}>
          {/*<Button disabled onClick={this.onClickDelete} kind={'danger'} iconDescription={'Impossible de supprimer une révision pour le moment'} renderIcon={TrashCan}>Supprimer</Button>*/}
          <Button onClick={this.onClickUpdate} iconDescription={'Mettre à jour'} renderIcon={Renew}>Mettre à jour</Button>
        </ButtonSet>
      </Stack>
    )
  }

}
