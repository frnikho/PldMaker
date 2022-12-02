import * as React from "react";
import Lottie from "lottie-react";
import { Tile } from "carbon-components-react";
import { TileStyle } from "@pld/ui";

export const PldDocumentsComponent = () => {
  return (
    <Tile style={TileStyle.default}>
      <h2 style={{fontWeight: 500}}>Documents</h2>
      <p>Pour le moment, les documents ne sont pas encore disponibles.</p>
      <Lottie animationData={require('../../../../assets/animations/wip.json')} loop={true} style={{width: '200px'}}/>
    </Tile>
  );
};
