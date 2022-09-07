import React from "react";
import {RequiredUserContextProps} from "../context/UserContext";
import { Button, MultiSelect, TextInput, Tile } from "carbon-components-react";
import {FieldData} from "../util/FieldData";
import {UserApiController} from "../controller/UserApiController";
import {toast} from "react-toastify";
import { formatLongDate } from "@pld/utils";

import {Renew} from '@carbon/icons-react';

import {Stack} from '@carbon/react';

export type UserComponentProps = RequiredUserContextProps;

export type UserComponentState = {
  firstname: FieldData<string>;
  lastname: FieldData<string>;
  domain: FieldData<string[]>;
}

export class UserComponent extends React.Component<UserComponentProps, UserComponentState> {

  constructor(props) {
    super(props);
    this.state = {
      firstname: {
        value: ''
      },
      lastname: {
        value: '',
      },
      domain: {
        value: [],
      }
    }
    this.onClickUpdate = this.onClickUpdate.bind(this);
  }

  override componentDidMount() {
    this.loadInfo();
    console.log(this.props.userContext.user);
  }

  private loadInfo() {
    if (this.props.userContext.user?.firstname === undefined || this.props.userContext.user?.lastname === undefined || this.props.userContext.user.domain === undefined)
      return;
    this.setState({
      firstname: {
        value: this.props.userContext.user.firstname,
      },
      lastname: {
        value: this.props.userContext.user.lastname,
      },
      domain: {
        value: this.props.userContext.user.domain,
      }
    })
  }

  private onClickUpdate() {
    UserApiController.updateUser(this.props.userContext.accessToken, {
      firstname: this.state.firstname.value,
      lastname: this.state.lastname.value,
      domain: this.state.domain.value,
    }, (user, error) => {
      if (error) {
        toast('Une erreur est survenue !', {type: 'error'});
        console.error(error);
      }
      if (user !== null) {
        toast('Informations de votre profile mis a jour 👍', {type: 'success'});
        this.loadInfo();
      }
    });
  }

  private showSecurity() {
    return (
      <Tile>
       {/* <h3 style={{marginBottom: 14}}>Sécurité</h3>
        <h4>Mot de passe</h4>
        <p>Vous pouvez changer votre mot passe actuel en cliquant <Link>ici</Link></p>
        <h4>2FA</h4>*/}
      </Tile>
    )
  }

  private showInfo() {
    return (<Tile>
      <h3 style={{marginBottom: '20px'}}>Mes informations</h3>
      <TextInput disabled id={"updated-user"} labelText={"Date de création"} value={formatLongDate(new Date(this.props.userContext.user?.created_date ?? ''))}/>
      <TextInput disabled id={"updated-user"} labelText={"Dernière mise a jour"} value={formatLongDate(new Date(this.props.userContext.user?.updated_date ?? ''))}/>
      <TextInput disabled id={"email-user"} labelText={"Email"} value={this.props.userContext.user?.email}/>
      <TextInput style={{marginBottom: '20px'}} id={"lastname"} labelText={"Nom"} value={this.state.lastname.value} onChange={(e) => {
        this.setState({
          lastname: {
            value: e.currentTarget.value
          }
        })
      }}/>
      <TextInput id={"firstname"} labelText={"Prénom"} value={this.state.firstname.value} onChange={(e) => {
        this.setState({
          firstname: {
            value: e.currentTarget.value
          }
        })
      }}/>
      <MultiSelect
        label={this.state.domain.value.join(', ')}
        titleText={"Domaines d'application"}
        id="domain-list"
        invalid={this.state.domain.error !== undefined}
        selectedItems={this.state.domain.value.map((domain) => ({label: domain}))}
        invalidText={this.state.domain.error}
        items={[{label: 'Mobile'}, {label: 'Server'}, {label: 'Web'}, {label: 'Autre'}]}
        onChange={(e) => {
          this.setState({
            domain: {
              value: e.selectedItems.map((a) => a.label)
            }
          })
        }}
      />
      <Button style={{marginTop: '20px'}} onClick={this.onClickUpdate} iconDescription={"Update"} renderIcon={Renew}>Mettre a jour</Button>
    </Tile>
    )
  }

  override render() {
    return (
      <Stack gap={4}>
        {this.showInfo()}
        {this.showSecurity()}
      </Stack>
    );
  }

}
