import * as React from "react";
import Lottie from "lottie-react";
import { Tile } from "carbon-components-react";
import { TileStyle } from "../../../style/TileStyle";

export const PldDocumentsComponent = () => {
  return (
    <Tile style={TileStyle.default}>
      <h2 style={{fontWeight: 500}}>Documents</h2>
      <p>Pour le moments, les documents ne sont pas encore disponible.</p>
      <Lottie>
        <Lottie animationData={require('../../../../assets/animations/wip.json')} loop={true} style={{width: '200px'}}/>
      </Lottie>
    </Tile>
  );
};
