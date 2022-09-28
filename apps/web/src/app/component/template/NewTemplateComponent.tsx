import React from "react";
import { RequiredUserContextProps } from "../../context/UserContext";

import { Stack } from "@carbon/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonSet,
  Checkbox,
  Column,
  Grid,
  MultiSelect,
  TextInput,
  Tile
} from "carbon-components-react";
import { FieldData } from "../../util/FieldData";
import { OrganizationApiController } from "../../controller/OrganizationApiController";
import { defaultTemplateDod, defaultTemplateHeader, defaultTemplateHeaderSections, defaultTemplateResume, defaultTemplateRevision, DodStatus, ObjectID, Organization, Template } from "@pld/shared";
import { NavProps } from "../../util/Navigation";

import {Add, View} from '@carbon/icons-react';
import { toast } from "react-toastify";

type HeaderInput = {
  generate: boolean;
  sections: Map<string, string>;
}

type DodInput = {
  generate: boolean;
  allStatus: boolean;
  status: ObjectID[];
}

export enum ViewMode {
  New = 'new',
  Edit = 'edit',
  Preview = 'preview',
}

export type NewTemplateProps = {
  mode: ViewMode;
  template?: Template;
  orgId: string;
} & RequiredUserContextProps & NavProps;

export type NewTemplateState = {
  org?: Organization;
  dodStatus: DodStatus[];
  nameInput: FieldData<string>;
  defaultInput: FieldData<boolean>;
  previewUrl?: string
  result?: Partial<Template>;

  dodForms: DodInput;
  headerForms: HeaderInput;
}

class NewTemplateComponent extends React.Component<NewTemplateProps, NewTemplateState> {

  constructor(props) {
    super(props);
    this.state = {
      dodForms: {
        generate: true,
        allStatus: true,
        status: [],
      },
      headerForms: {
        generate: true,
        sections: defaultTemplateHeaderSections,
      },
      dodStatus: [],
      result: {
        org: undefined,
        owner: undefined,
        createdDate: new Date(),
        title: '',
        useAsDefault: false,
        dodTemplate: defaultTemplateDod,
        headerTemplate: defaultTemplateHeader,
        resumeTemplate: defaultTemplateResume,
        revisionTemplate: defaultTemplateRevision,
      },
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
    this.loadDodStatus();
  }

  private onClickPreview() {
    if (this.state.org === undefined)
      return;
    this.transformResult();
    /*const dodDocx = new DodDocx({
      _id: 'abc',
      created_date: new Date(),
      estimatedWorkTime: [{value: 2, users: [{_id: '', devices: [], email: 'nicolas.sansd@gmail.com', firstname: 'Nico', lastname: 'S', timezone: Timezone["Europe/Paris"]}], format: ''}],
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
*/
  }

  /*private showDescriptionFields() {
    return (
      <Table size="sm" useZebraStyles={false}>
        <TableHead>
          <TableRow>
            <TableHeader id={''} key={''}>Champ</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={''}>
          </TableRow>
        </TableBody>
      </Table>
    );
  }*/

  private loadDodStatus() {
    OrganizationApiController.getOrgDodStatus(this.props.userContext.accessToken, this.props.orgId, (dodStatus, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      } else if (dodStatus !== null) {
        this.setState({dodStatus: dodStatus});
      }
    });
  }

  private loadOrg() {
    OrganizationApiController.findOrganizationById(this.props.userContext.accessToken, this.props.orgId, (org, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
      } else if (org !== null) {
        this.setState({org});
      }
    });
  }

  private preview() {
    return (
      <>

      </>
    )
  }

  private updateDodField(field: keyof DodInput, value: unknown) {
    this.setState({dodForms: {
      ...this.state.dodForms,
      [field]: value,
      }
    });
  }

  private showDodStatusSelect() {
    const items = this.state.dodStatus.map((dod) => ({label: dod.name, value: dod._id}));
    return (
      <MultiSelect disabled={this.state.dodForms.allStatus} id={'dod.status'} label={this.state.dodForms.status.length === 0 ? "Status des Dods a prendre en compte" : items.filter((i) => this.state.dodForms.status.find((a) => a === i.value)).map((a) => a.label).join(', ')} selectedItems={items.filter((i) => this.state.dodForms.status.find((a) => a === i.value))} items={items} onChange={({selectedItems}) => {
        this.updateDodField('status', selectedItems.map((a) => a.value));
      }}/>
    )
  }

  private content() {
    if (this.state.org === undefined)
      return;
    return (
      <Stack gap={3}>
        <h4>Description du document</h4>
        <Stack>
          <Checkbox id={'description-generate'} labelText={"Générer ?"}/>
        </Stack>
        <h4>Tableau des révisions</h4>
        <Stack>
          <Checkbox id={'revision-generate'} labelText={"Générer ?"}/>
        </Stack>
        <h4>DoDs</h4>
        <Stack>
          <Checkbox id={'dod-generate'} labelText={"Générer ?"} checked={this.state.dodForms.generate} onChange={((a, {checked}) => this.updateDodField('generate', checked))}/>
          <Checkbox id={'dod.all_status'} labelText={"Générer toutes les DoDs ?"} checked={this.state.dodForms.allStatus} onChange={((a, {checked}) => this.updateDodField('allStatus', checked))}/>
          {this.showDodStatusSelect()}
        </Stack>
        <h4>Rapport d'avancement</h4>
        <Stack>
          <Checkbox id={'resume-generate'} labelText={"Généré ?"}/>
        </Stack>
      </Stack>
    );
  }

  private transformResult() {
    console.log(this.state.dodForms);
  }

  override render() {
    return (
      <div onKeyDown={(event) => {
        if (event.ctrlKey && event.key === 'Enter')
          this.transformResult();
      }}>
        <Breadcrumb noTrailingSlash style={{marginBottom: '40px'}}>
          <BreadcrumbItem onClick={() => this.props.navigate(`/`)}>Dashboard</BreadcrumbItem>
          <BreadcrumbItem onClick={() => this.props.navigate(`/organization/${this.state.org?._id}`)}>Organisation</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>Template</BreadcrumbItem>
        </Breadcrumb>
        <Stack gap={6}>
          <h1 style={{fontWeight: 'bold'}}>Créer un nouveau template</h1>
          <TextInput helperText={"le titre doit contenir au minimum 3 caractères et maximum 128 caractères"} id={"template-name"} labelText={"Nom"}/>
          <Checkbox id={"template-default"} labelText={"Template par défaut ?"}/>
          <Grid>
            <Column lg={8}>
              <Tile>
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
            <Button renderIcon={View} onClick={this.onClickPreview}>Preview</Button>
            <Button renderIcon={Add}>Créer</Button>
          </ButtonSet>
        </Stack>
      </div>
    );
  }
}

export default NewTemplateComponent;
