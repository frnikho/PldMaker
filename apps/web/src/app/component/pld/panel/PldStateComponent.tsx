import * as React from "react";
import { Tile } from "carbon-components-react";
import { Pld } from "@pld/shared";

import {Stack} from '@carbon/react';
import { TileStyle } from "@pld/ui";

type Props = {
  pld: Pld;
};
export const PldStateComponent = (props: Props) => {
  return (
    <Tile style={TileStyle.default}>
      <Stack gap={6}>
        <h4>Status : {new Date(props.pld.endingDate).getTime() < new Date().getTime() ? 'Signé' : props.pld.status.toUpperCase()}</h4>
      </Stack>
    </Tile>
  )
};
