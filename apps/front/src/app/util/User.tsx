import {Pld, Organization, FavourType} from "@pld/shared";
import React from "react";
import {UserContext} from "../context/UserContext";
import {Button} from "carbon-components-react";

import {Star, StarFilled} from '@carbon/icons-react';
import {UserApiController} from "../controller/UserApiController";

export type ShowFavourIconProps = {
  type: FavourType;
  data: Pld | Organization;
  clickable?: boolean;
};

export class ShowFavourIcon extends React.Component<ShowFavourIconProps, unknown> {

  static override contextType = UserContext;
  override context!: React.ContextType<typeof UserContext>;

  constructor(props) {
    super(props);
    this.removeFavour = this.removeFavour.bind(this);
    this.addFavour = this.addFavour.bind(this);
  }

  private addFavour() {
    UserApiController.addFavour(this.context.accessToken, {
      type: this.props.type,
      data_id: this.props.data._id,
    }, (user, error) => {
      if (error) {
        console.log(error);
      }
      this.context.refreshFavours();
    })
  }

  private removeFavour() {
    UserApiController.removeFavour(this.context.accessToken, {
      favourId: this.props.data._id
    }, (user, error) => {
      if (error) {
        console.log(error);
      }
      this.context.refreshFavours();
    })
  }

  private showIcon() {
    if (this.context?.favours?.pld?.some((pld) => {
      return pld._id === this.props.data._id
    })) {
      return (<Button kind={"ghost"} hasIconOnly renderIcon={StarFilled} iconDescription={"Favoris"} onClick={this.removeFavour} disabled={this.props.clickable !== undefined && !this.props.clickable}/>);
    } else {
      return (<Button kind={"ghost"} hasIconOnly renderIcon={Star} iconDescription={"Favoris"} onClick={this.addFavour} disabled={this.props.clickable !== undefined && !this.props.clickable}/>);
    }
  }

  override render() {
    return this.showIcon();
  }

}
