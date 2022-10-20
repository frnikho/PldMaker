import * as React from "react";
import { Column, SkeletonPlaceholder, SkeletonText, Tile } from "carbon-components-react";

import {Stack} from '@carbon/react';
import { TileStyle } from "@pld/ui";


export const PldQuickInfoSkeleton = () => {

  return (
    <Tile style={TileStyle.default}>
      <Stack gap={6}>
        <div>
          <h4 style={{fontWeight: 600}}>Date de création :</h4>
          <SkeletonText/>
        </div>
        <div>
          <h4 style={{fontWeight: 600}}>Dernière mise à jour :</h4>
          <SkeletonText/>
        </div>
        <div>
          <Stack orientation={"horizontal"}>
            <Column lg={3}>
              <h4 style={{}}>Version actuelle </h4>
              <SkeletonPlaceholder/>
            </Column>
            <Column lg={3}>
              <h4 style={{}}>Nombre de révisions </h4>
              <SkeletonPlaceholder/>
            </Column>
          </Stack>
        </div>
      </Stack>
    </Tile>
  )
};
