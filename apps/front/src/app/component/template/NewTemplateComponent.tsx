import React from "react";
import {RequiredUserContextProps} from "../../context/UserContext";

import {Stack} from '@carbon/react';
import {Button, ButtonSet, Checkbox, Column, Grid, TextInput, Tile} from "carbon-components-react";
import {FieldData} from "../../util/FieldData";
import {OrganizationApiController} from "../../controller/OrganizationApiController";
import {Organization} from "../../../../../../libs/data-access/organization/Organization";
import {DodDocx} from "../../docx/DodDocx";
import {Document, Packer} from "docx";

export enum ViewMode {
  New = 'new',
  Edit = 'edit',
  Preview = 'preview',
}

export type NewTemplateProps = {
  mode: ViewMode;
  templateId?: string;
  orgId: string;
} & RequiredUserContextProps;

export type NewTemplateState = {
  org?: Organization;
  nameInput: FieldData<string>;
  defaultInput: FieldData<boolean>;
  previewUrl?: string
}

export class NewTemplateComponent extends React.Component<NewTemplateProps, NewTemplateState> {

  constructor(props) {
    super(props);
    this.state = {
      org: undefined,
      defaultInput: {
        value: false,
      },
      nameInput: {
        value: ''
      },
      previewUrl: undefined
    }
    this.onClickPreview = this.onClickPreview.bind(this);
  }

  override componentDidMount() {
    this.loadOrg();
  }

  private onClickPreview() {
    if (this.state.org === undefined)
      return;
    const dodDocx = new DodDocx({
      _id: 'abc',
      created_date: new Date(),
      estimatedWorkTime: [{value: 2, users: ['nicolas.sansd@gmail.com'], format: ''}],
      description: '',
      status: 'A faire',
      title: 'Hello World',
      owner: 'abc',
      descriptionOfDone: [''],
      history: [],
      pldOwner: 'me',
      skinOf: 'Développeur',
      updated_date: new Date(),
      version: '2.1.3',
      want: 'Dire bonjour',
    }, this.state.org);

    const document = new Document({
        sections: [{
          children: [dodDocx.generateTable()]
        }],
      }
    );

    Packer.toBlob(document).then((blob) => {
      this.setState({
        previewUrl: URL.createObjectURL(blob),
      })
      console.log(this.state.previewUrl);
    })

  }

  private loadOrg() {
    OrganizationApiController.findOrganizationById(this.props.userContext.accessToken, this.props.orgId, (org, error) => {
      if (error) {
        console.log(error); //TODO manage error
      }
      if (org !== null) {
        this.setState({
          org,
        });
      }
    });
  }

  private preview() {
    if (this.state.org === undefined || this.state.previewUrl === undefined)
      return;

    const docs = [
      { uri: this.state.previewUrl },
    ];

    return <></>;
  }

  private content() {
    if (this.state.org === undefined)
      return;
    return (<></>)
  }

  override render() {
    return (
      <Stack gap={6}>
        <TextInput id={"template-name"} labelText={"Nom du template"}/>
        <Checkbox id={"template-default"} labelText={"Template par défaut ?"}/>
        <Grid>
          <Column lg={8}>
            <Tile>
              <h3>Content</h3>
              {this.content()}
            </Tile>
          </Column>
          <Column lg={8}>
            <Tile>
              <h3>Preview</h3>
              {this.preview()}
            </Tile>
          </Column>
        </Grid>
        <ButtonSet>
          <Button>Créer</Button>
          <Button onClick={this.onClickPreview}>Preview</Button>
        </ButtonSet>
      </Stack>
    );
  }
}
