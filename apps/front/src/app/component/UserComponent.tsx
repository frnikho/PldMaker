import React from "react";
import {RequiredUserContextProps} from "../context/UserContext";
import {Button, MultiSelect, TextInput, Tile} from "carbon-components-react";
import {FieldData} from "../util/FieldData";
import {UserApiController} from "../controller/UserApiController";
import {UserDomain} from "../../../../../libs/data-access/user/User";
import {toast} from "react-toastify";

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

  override render() {
    return (
      <Tile>
        <h4 style={{marginBottom: '20px'}}>Mes informations</h4>
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
          label="Domaine concernés:"
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

        <Button style={{marginTop: '20px'}} onClick={this.onClickUpdate} >Mettre a jour</Button>
      </Tile>
    );
  }

}
