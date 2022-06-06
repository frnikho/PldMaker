import {Navigate, useParams} from "react-router-dom";
import React from "react";

export type NavigationState = {
  navigateUrl?: string;
}

export const redirectNavigation = (navigationUrl?: string): JSX.Element | null => {
  if (navigationUrl !== undefined)
    return (<Navigate to={navigationUrl}/>)
  return null;
}

export const withParams = (Component) => {
  return props => <Component {...props} params={useParams()} />;
}
