import * as React from "react";
import {DataTableSkeleton, Tile } from "carbon-components-react";
import { TileStyle } from "../../../style/TileStyle";

export const PldDoDsSkeleton = () => {

  return (
    <Tile style={TileStyle.default}>
      <h2 style={{fontWeight: 500}}>DoDs</h2>
      <DataTableSkeleton/>
    </Tile>
  );
};
