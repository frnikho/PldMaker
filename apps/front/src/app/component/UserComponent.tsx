import React from "react";
import {RequiredUserContextProps} from "../context/UserContext";
import {Button, TextInput, Tile} from "carbon-components-react";
import {FieldData} from "../util/FieldData";
import {UserApiController} from "../controller/UserApiController";

export type UserComponentProps = RequiredUserContextProps;

export type UserComponentState = {
  firstname: FieldData<string>;
  lastname: FieldData<string>;
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
      }
    }
    this.onClickUpdate = this.onClickUpdate.bind(this);
  }

  override componentDidMount() {
    this.loadInfo();
  }

  private loadInfo() {
    if (this.props.userContext.user?.firstname === undefined || this.props.userContext.user?.lastname === undefined)
      return;
    this.setState({
      firstname: {
        value: this.props.userContext.user.firstname,
      },
      lastname: {
        value: this.props.userContext.user.lastname,
      }
    })
  }

  private onClickUpdate() {
    UserApiController.updateUser(this.props.userContext.accessToken, {
      firstname: this.state.firstname.value,
      lastname: this.state.lastname.value,
    }, (user, error) => {
      if (error) {
        console.error(error);
      }
      if (user !== null) {
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
        <Button style={{marginTop: '20px'}} onClick={this.onClickUpdate} >Mettre a jour</Button>
      </Tile>
    );
  }

}
